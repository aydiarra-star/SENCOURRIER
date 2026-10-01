import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@sencourrier/database';
import { ArticleStatus } from '@sencourrier/types';
import { PRISMA } from '../../infra/prisma/prisma.module';
import { buildPagination } from '../../common/interceptors/pagination.interceptor';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

@Injectable()
export class AuthorsService {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async list(query: PaginationQueryDto) {
    const where = {
      isActive: true,
      ...(query.search
        ? { displayName: { contains: query.search, mode: 'insensitive' as const } }
        : {}),
    };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.authorProfile.findMany({
        where,
        orderBy: [{ isFeatured: 'desc' }, { articleCount: 'desc' }],
        skip: query.skip,
        take: query.perPage,
        select: {
          slug: true,
          displayName: true,
          jobTitle: true,
          avatarUrl: true,
          bio: true,
          location: true,
          expertise: true,
          articleCount: true,
        },
      }),
      this.prisma.authorProfile.count({ where }),
    ]);

    return { data: rows, meta: buildPagination(query.page, query.perPage, total) };
  }

  async findBySlug(slug: string) {
    const author = await this.prisma.authorProfile.findFirst({
      where: { slug, isActive: true },
      select: {
        id: true,
        userId: true,
        slug: true,
        displayName: true,
        jobTitle: true,
        bio: true,
        avatarUrl: true,
        coverImageUrl: true,
        twitterHandle: true,
        linkedinUrl: true,
        emailPublic: true,
        location: true,
        expertise: true,
        articleCount: true,
        totalViews: true,
      },
    });

    if (!author) throw new NotFoundException('Profil introuvable.');

    const articles = await this.prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        deletedAt: null,
        publishedAt: { lte: new Date() },
        authors: { some: { userId: author.userId } },
      },
      orderBy: { publishedAt: 'desc' },
      take: 20,
      select: {
        slug: true,
        title: true,
        excerpt: true,
        publishedAt: true,
        readingMinutes: true,
        isPremium: true,
        category: { select: { slug: true, name: true, accent: true } },
        heroImage: { select: { url: true, altText: true, blurDataUrl: true } },
      },
    });

    return { ...author, articles };
  }

  /** Journalistes mis en avant sur la page « La rédaction ». */
  async featured(limit = 8) {
    return this.prisma.authorProfile.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { articleCount: 'desc' },
      take: limit,
      select: {
        slug: true,
        displayName: true,
        jobTitle: true,
        avatarUrl: true,
        bio: true,
        expertise: true,
        articleCount: true,
      },
    });
  }
}
