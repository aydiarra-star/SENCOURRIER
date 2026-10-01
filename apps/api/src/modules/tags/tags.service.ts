import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@sencourrier/database';
import { ArticleStatus } from '@sencourrier/types';
import { PRISMA } from '../../infra/prisma/prisma.module';

@Injectable()
export class TagsService {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  /** Nuage de tags : les plus utilisés d'abord, tendances en tête. */
  async cloud(limit = 40) {
    return this.prisma.tag.findMany({
      where: { usageCount: { gt: 0 } },
      orderBy: [{ isTrending: 'desc' }, { usageCount: 'desc' }],
      take: limit,
      select: { slug: true, name: true, usageCount: true, isTrending: true },
    });
  }

  async trending(limit = 10) {
    return this.prisma.tag.findMany({
      where: { isTrending: true },
      orderBy: { usageCount: 'desc' },
      take: limit,
      select: { slug: true, name: true, usageCount: true },
    });
  }

  async findBySlug(slug: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { slug },
      select: { id: true, slug: true, name: true, description: true, usageCount: true },
    });
    if (!tag) throw new NotFoundException('Mot-clé introuvable.');

    const articleCount = await this.prisma.article.count({
      where: {
        status: ArticleStatus.PUBLISHED,
        deletedAt: null,
        publishedAt: { lte: new Date() },
        tags: { some: { tagId: tag.id } },
      },
    });

    return { ...tag, articleCount };
  }
}
