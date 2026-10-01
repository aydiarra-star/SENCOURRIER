import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@sencourrier/database';
import { ArticleStatus } from '@sencourrier/types';
import { PRISMA } from '../../infra/prisma/prisma.module';

interface CategoryNode {
  id: string;
  slug: string;
  name: string;
  shortName: string | null;
  description: string | null;
  accent: string;
  icon: string | null;
  coverImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  children: CategoryNode[];
}

@Injectable()
export class CategoriesService {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  /**
   * Arborescence complète du menu.
   *
   * L'arborescence éditoriale est figée par la rédaction : une seule requête
   * plate puis un assemblage en mémoire coûtent moins cher que N+1 requêtes,
   * et la structure change rarement.
   */
  async tree(): Promise<CategoryNode[]> {
    const rows = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ position: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        slug: true,
        name: true,
        shortName: true,
        description: true,
        accent: true,
        icon: true,
        coverImage: true,
        seoTitle: true,
        seoDescription: true,
        parentId: true,
      },
    });

    const byId = new Map<string, CategoryNode>();
    const roots: CategoryNode[] = [];

    for (const row of rows) {
      byId.set(row.id, { ...row, children: [] });
    }

    for (const row of rows) {
      const node = byId.get(row.id)!;
      if (row.parentId && byId.has(row.parentId)) {
        byId.get(row.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  async menu() {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true, isInMenu: true, parentId: null },
      orderBy: [{ position: 'asc' }],
      select: {
        slug: true,
        name: true,
        shortName: true,
        accent: true,
        icon: true,
        children: {
          where: { isActive: true },
          orderBy: [{ position: 'asc' }],
          select: { slug: true, name: true, accent: true },
        },
      },
    });
    return categories;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findFirst({
      where: { slug, isActive: true },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        accent: true,
        coverImage: true,
        seoTitle: true,
        seoDescription: true,
        parent: { select: { slug: true, name: true } },
        children: {
          where: { isActive: true },
          orderBy: { position: 'asc' },
          select: { slug: true, name: true, accent: true },
        },
      },
    });

    if (!category) throw new NotFoundException('Rubrique introuvable.');

    const articleCount = await this.prisma.article.count({
      where: {
        categoryId: category.id,
        status: ArticleStatus.PUBLISHED,
        deletedAt: null,
        publishedAt: { lte: new Date() },
      },
    });

    return { ...category, articleCount };
  }
}
