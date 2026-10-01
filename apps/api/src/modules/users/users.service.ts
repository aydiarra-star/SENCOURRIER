import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@sencourrier/database';
import { ArticleStatus } from '@sencourrier/types';
import { PRISMA } from '../../infra/prisma/prisma.module';
import { RedisService } from '../../infra/redis/redis.service';
import { buildPagination } from '../../common/interceptors/pagination.interceptor';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { ARTICLE_CARD_SELECT, toArticleCard } from '../articles/article.select';

@Injectable()
export class UsersService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly redis: RedisService,
  ) {}

  async profile(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        displayName: true,
        name: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        preferences: true,
        authorProfile: { select: { slug: true, jobTitle: true, bio: true } },
      },
    });

    if (!user) throw new NotFoundException('Compte introuvable.');
    return user;
  }

  async updateProfile(
    userId: string,
    data: { displayName?: string; image?: string; bio?: string; jobTitle?: string },
  ) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.displayName ? { displayName: data.displayName, name: data.displayName } : {}),
        ...(data.image ? { image: data.image } : {}),
        ...((data.bio || data.jobTitle) && {
          authorProfile: {
            upsert: {
              create: {
                slug: userId,
                displayName: data.displayName ?? '',
                bio: data.bio,
                jobTitle: data.jobTitle,
              },
              update: { bio: data.bio, jobTitle: data.jobTitle },
            },
          },
        }),
      },
      select: { id: true, displayName: true, image: true },
    });

    return user;
  }

  async updatePreferences(
    userId: string,
    data: Partial<{
      darkMode: boolean;
      breakingNewsAlerts: boolean;
      newArticleAlerts: boolean;
      weeklyDigest: boolean;
      newsletterOptIn: boolean;
      preferredCategories: string[];
      preferredLanguage: string;
      fontScale: number;
      reducedMotion: boolean;
    }>,
  ) {
    return this.prisma.userPreference.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
  }

  /** Historique de lecture : le plus récent d'abord, sans doublon d'article. */
  async readingHistory(userId: string, query: PaginationQueryDto) {
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.readingHistory.findMany({
        where: { userId },
        orderBy: { readAt: 'desc' },
        skip: query.skip,
        take: query.perPage,
        select: {
          readAt: true,
          progress: true,
          article: { select: ARTICLE_CARD_SELECT },
        },
      }),
      this.prisma.readingHistory.count({ where: { userId } }),
    ]);

    return {
      data: rows.map((row) => ({
        ...toArticleCard(row.article),
        readAt: row.readAt,
        progress: row.progress,
      })),
      meta: buildPagination(query.page, query.perPage, total),
    };
  }

  async bookmarks(userId: string, query: PaginationQueryDto) {
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.bookmark.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: query.skip,
        take: query.perPage,
        select: { createdAt: true, article: { select: ARTICLE_CARD_SELECT } },
      }),
      this.prisma.bookmark.count({ where: { userId } }),
    ]);

    return {
      data: rows.map((row) => ({ ...toArticleCard(row.article), savedAt: row.createdAt })),
      meta: buildPagination(query.page, query.perPage, total),
    };
  }

  /** Bascule un favori : une seule requête, pas de course entre deux onglets. */
  async toggleBookmark(userId: string, articleId: string) {
    const existing = await this.prisma.bookmark.findUnique({
      where: { userId_articleId: { userId, articleId } },
      select: { id: true },
    });

    if (existing) {
      await this.prisma.bookmark.delete({ where: { id: existing.id } });
      await this.redis.del(`bookmarks:${userId}`);
      return { saved: false };
    }

    const article = await this.prisma.article.findFirst({
      where: { id: articleId, deletedAt: null },
      select: { id: true },
    });
    if (!article) throw new NotFoundException('Article introuvable.');

    await this.prisma.bookmark.create({ data: { userId, articleId } });
    await this.redis.del(`bookmarks:${userId}`);
    return { saved: true };
  }

  async recordReading(userId: string, articleId: string, progress = 0) {
    const article = await this.prisma.article.findFirst({
      where: { id: articleId, status: ArticleStatus.PUBLISHED, deletedAt: null },
      select: { id: true },
    });
    if (!article) throw new NotFoundException('Article introuvable.');

    await this.prisma.readingHistory.upsert({
      where: { userId_articleId: { userId, articleId } },
      update: { readAt: new Date(), progress },
      create: { userId, articleId, progress },
    });

    return { recorded: true };
  }

  async notifications(userId: string, query: PaginationQueryDto) {
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: query.skip,
        take: query.perPage,
        select: {
          id: true,
          kind: true,
          title: true,
          body: true,
          url: true,
          readAt: true,
          createdAt: true,
        },
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);

    return {
      data: rows.map((row) => ({ ...row, isRead: row.readAt !== null })),
      meta: buildPagination(query.page, query.perPage, total),
    };
  }

  async markNotificationsRead(userId: string, ids?: string[]) {
    await this.prisma.notification.updateMany({
      where: { userId, ...(ids?.length ? { id: { in: ids } } : { readAt: null }) },
      data: { readAt: new Date() },
    });
    return { read: true };
  }

  /**
   * Suppression du compte.
   *
   * Anonymisation plutôt que suppression physique : les articles signés et les
   * commentaires restent attribués à un profil neutralisé, ce qui préserve
   * l'intégrité éditoriale tout en respectant le droit à l'effacement.
   */
  async deleteAccount(userId: string) {
    await this.prisma.$transaction([
      this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
      this.prisma.bookmark.deleteMany({ where: { userId } }),
      this.prisma.readingHistory.deleteMany({ where: { userId } }),
      this.prisma.user.update({
        where: { id: userId },
        data: {
          email: `supprime+${userId}@sencourrier.invalid`,
          displayName: 'Compte supprimé',
          name: 'Compte supprimé',
          image: null,
          passwordHash: null,
          isActive: false,
          deletedAt: new Date(),
        },
      }),
    ]);

    return { deleted: true };
  }
}
