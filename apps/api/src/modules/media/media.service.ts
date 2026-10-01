import {
  BlobServiceClient,
  ContainerClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@sencourrier/database';
import { MediaType } from '@sencourrier/types';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import slugify from 'slugify';
import { PRISMA } from '../../infra/prisma/prisma.module';
import { RedisService } from '../../infra/redis/redis.service';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

export interface UploadResult {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  blurDataUrl: string | null;
  sizeBytes: number;
  mimeType: string;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private readonly container: ContainerClient | null;

  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {
    const connectionString = config.get<string>('AZURE_STORAGE_CONNECTION_STRING');
    const accountName = config.get<string>('AZURE_STORAGE_ACCOUNT_NAME');
    const accountKey = config.get<string>('AZURE_STORAGE_ACCOUNT_KEY');
    const containerName = config.get<string>('AZURE_STORAGE_CONTAINER_MEDIA', 'media');

    let client: BlobServiceClient | null = null;

    if (connectionString) {
      client = BlobServiceClient.fromConnectionString(connectionString);
    } else if (accountName && accountKey) {
      client = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        new StorageSharedKeyCredential(accountName, accountKey),
      );
    }

    this.container = client ? client.getContainerClient(containerName) : null;
  }

  get enabled(): boolean {
    return this.container !== null;
  }

  /**
   * Téléverse une image et prépare ses métadonnées éditoriales.
   *
   * Les dimensions et l'aperçu flou sont calculés une seule fois, à l'import :
   * le front peut ainsi réserver la place exacte de l'image et éviter tout
   * décalage de mise en page (CLS).
   */
  async uploadImage(
    file: Buffer,
    originalName: string,
    uploadedById?: string,
  ): Promise<UploadResult> {
    if (!this.enabled) {
      throw new ServiceUnavailableException(
        'Le stockage Azure Blob n’est pas configuré sur cet environnement.',
      );
    }

    if (file.length > MAX_IMAGE_BYTES) {
      throw new BadRequestException('L’image dépasse la taille maximale de 12 Mo.');
    }

    const image = sharp(file);
    const metadata = await image.metadata();

    if (!metadata.format || !ALLOWED_IMAGE_TYPES.includes(`image/${metadata.format}`)) {
      throw new BadRequestException('Format d’image non pris en charge (JPEG, PNG, WebP, AVIF).');
    }

    const mimeType = `image/${metadata.format}`;
    const baseName =
      slugify(originalName.replace(/\.[^.]+$/, ''), { lower: true, strict: true }) || 'media';
    const storageKey = `${new Date().toISOString().slice(0, 7)}/${baseName}-${randomUUID().slice(0, 8)}.webp`;

    const optimized = await image
      .clone()
      .rotate()
      .resize({ width: 2000, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const thumbnail = await image
      .clone()
      .rotate()
      .resize({ width: 480, withoutEnlargement: true })
      .webp({ quality: 70 })
      .toBuffer();

    const blur = await image.clone().resize({ width: 16 }).webp({ quality: 30 }).toBuffer();

    await this.container!.getBlockBlobClient(storageKey).uploadData(optimized, {
      blobHTTPHeaders: {
        blobContentType: 'image/webp',
        blobCacheControl: 'public, max-age=31536000, immutable',
      },
    });

    const thumbKey = storageKey.replace(/\.webp$/, '-480.webp');
    await this.container!.getBlockBlobClient(thumbKey).uploadData(thumbnail, {
      blobHTTPHeaders: {
        blobContentType: 'image/webp',
        blobCacheControl: 'public, max-age=31536000, immutable',
      },
    });

    const baseUrl = this.config.get<string>('AZURE_STORAGE_PUBLIC_BASE_URL') || this.container!.url;

    const media = await this.prisma.media.create({
      data: {
        type: MediaType.IMAGE,
        url: `${baseUrl}/${storageKey}`,
        thumbnailUrl: `${baseUrl}/${thumbKey}`,
        storageKey,
        mimeType,
        sizeBytes: optimized.byteLength,
        width: metadata.width ?? null,
        height: metadata.height ?? null,
        altText: baseName.replace(/-/g, ' '),
        blurDataUrl: `data:image/webp;base64,${blur.toString('base64')}`,
        uploadedById,
      },
      select: {
        id: true,
        url: true,
        thumbnailUrl: true,
        width: true,
        height: true,
        blurDataUrl: true,
        sizeBytes: true,
        mimeType: true,
      },
    });

    return {
      id: media.id,
      url: media.url,
      thumbnailUrl: media.thumbnailUrl,
      width: media.width,
      height: media.height,
      blurDataUrl: media.blurDataUrl,
      sizeBytes: media.sizeBytes ?? optimized.byteLength,
      mimeType: media.mimeType ?? mimeType,
    };
  }

  async list(page = 1, perPage = 24) {
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.media.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
        select: {
          id: true,
          url: true,
          thumbnailUrl: true,
          altText: true,
          caption: true,
          width: true,
          height: true,
          sizeBytes: true,
          createdAt: true,
          uploadedById: true,
        },
      }),
      this.prisma.media.count({ where: { deletedAt: null } }),
    ]);

    return { data: rows, meta: { page, perPage, total } };
  }

  async updateMetadata(id: string, data: { altText?: string; caption?: string; credit?: string }) {
    const media = await this.prisma.media.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!media) throw new NotFoundException('Média introuvable.');

    return this.prisma.media.update({ where: { id }, data });
  }

  /** Suppression logique : les URL publiques restent valides pour les articles indexés. */
  async remove(id: string): Promise<void> {
    const media = await this.prisma.media.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!media) throw new NotFoundException('Média introuvable.');

    await this.prisma.media.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  /** Purge le cache CDN logique après remplacement d'une image. */
  async invalidate(id: string): Promise<void> {
    await this.redis.del(`media:${id}`);
  }
}
