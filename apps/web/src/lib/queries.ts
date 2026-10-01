import { cache } from 'react';
import { prisma } from '@/lib/db';
import { Prisma, type ArticleFormat, type ArticleStatus } from '@sencourrier/database';

/**
 * Normalisation SQL pour la recherche éditoriale : minuscules et suppression
 * des diacritiques, afin que « Senegal » trouve « Sénégal » (et inversement).
 * L'expression est identique à celle des index d'expression créés par la
 * migration `20260930200000_editorial_search_indexes`.
 */
const normalize = (column: Prisma.Sql): Prisma.Sql =>
  Prisma.sql`lower(public.sencourrier_unaccent(${column}))`;

const normalizePattern = (term: string): Prisma.Sql =>
  Prisma.sql`lower(public.sencourrier_unaccent(${term}))`;

/** Colonnes strictement nécessaires à l'affichage d'une carte d'article. */
const CARD_SELECT = {
  id: true,
  slug: true,
  title: true,
  subtitle: true,
  excerpt: true,
  isPremium: true,
  isBreaking: true,
  isFeatured: true,
  format: true,
  readingMinutes: true,
  viewCount: true,
  commentCount: true,
  publishedAt: true,
  category: { select: { id: true, slug: true, name: true, shortName: true, accent: true } },
  heroImage: { select: { url: true, thumbnailUrl: true, altText: true, width: true, height: true } },
  authors: {
    select: {
      position: true,
      role: true,
      user: { select: { id: true, displayName: true, name: true, image: true } },
    },
    orderBy: { position: 'asc' as const },
  },
} as const;

export type ArticleCard = Awaited<ReturnType<typeof getArticleCards>>[number];

/**
 * React `cache` déduplique les appels au sein d'un même rendu : la page
 * d'accueil demande les mêmes listes depuis plusieurs composants.
 */
export const getArticleCards = cache(
  async (options: {
    categorySlug?: string;
    tagSlug?: string;
    authorId?: string;
    limit?: number;
    offset?: number;
    excludeIds?: string[];
    onlyPremium?: boolean;
    onlyBreaking?: boolean;
  } = {}) => {
    const { categorySlug, tagSlug, authorId, limit = 12, offset = 0, excludeIds, onlyPremium, onlyBreaking } = options;

    return prisma.article.findMany({
      where: {
        status: 'PUBLISHED' as ArticleStatus,
        deletedAt: null,
        publishedAt: { lte: new Date() },
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
        ...(tagSlug ? { tags: { some: { tag: { slug: tagSlug } } } } : {}),
        ...(authorId ? { authors: { some: { userId: authorId } } } : {}),
        ...(excludeIds?.length ? { id: { notIn: excludeIds } } : {}),
        ...(onlyPremium ? { isPremium: true } : {}),
        ...(onlyBreaking ? { isBreaking: true } : {}),
      },
      select: CARD_SELECT,
      orderBy: { publishedAt: 'desc' },
      take: limit,
      skip: offset,
    });
  },
);

/** Article de tête : le plus récent mis en avant, sinon le plus récent. */
/**
 * Enveloppe une lecture de contenu : si la base est momentanément injoignable
 * (démarrage à froid, incident, construction de l'image), le rendu se poursuit
 * avec une valeur de repli plutôt que d'échouer en erreur 500.
 */
export async function safeQuery<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.error('[sencourrier] lecture base de données indisponible', error);
    return fallback;
  }
}

export const getLeadArticle = cache(async () => {
  return prisma.article.findFirst({
    where: { status: 'PUBLISHED' as ArticleStatus, deletedAt: null, publishedAt: { lte: new Date() } },
    orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
    select: CARD_SELECT,
  });
});

/** Bandeau « dernière minute ». */
export const getBreakingNews = cache(async (limit = 6) => {
  return prisma.article.findMany({
    where: {
      status: 'PUBLISHED' as ArticleStatus,
      deletedAt: null,
      isBreaking: true,
      publishedAt: { lte: new Date() },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      publishedAt: true,
      category: { select: { slug: true, name: true, accent: true } },
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });
});

/** Article complet avec relations, pour la page article. */
export const getArticleBySlug = cache(async (slug: string) => {
  return prisma.article.findFirst({
    where: { slug, status: 'PUBLISHED' as ArticleStatus, deletedAt: null },
    include: {
      category: {
        include: { parent: { select: { slug: true, name: true } } },
      },
      heroImage: true,
      gallery: { include: { media: true }, orderBy: { position: 'asc' } },
      tags: { include: { tag: true } },
      authors: {
        include: {
          user: {
            include: { authorProfile: true },
          },
        },
        orderBy: { position: 'asc' },
      },
    },
  });
});

/** Catégories affichées dans le menu principal. */
export const getMenuCategories = cache(async () => {
  return prisma.category.findMany({
    where: { isInMenu: true, isActive: true, parentId: null },
    select: {
      id: true,
      slug: true,
      name: true,
      shortName: true,
      accent: true,
      children: {
        where: { isActive: true },
        select: { id: true, slug: true, name: true },
        orderBy: { position: 'asc' },
      },
    },
    orderBy: { position: 'asc' },
  });
});

/** Dernières minutes : titres publiés dans les dernières 24 heures. */
export const getLatestUpdates = cache(async (limit = 8) => {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return prisma.article.findMany({
    where: { status: 'PUBLISHED' as ArticleStatus, deletedAt: null, publishedAt: { gte: since, lte: new Date() } },
    select: {
      id: true,
      slug: true,
      title: true,
      publishedAt: true,
      category: { select: { slug: true, name: true, accent: true } },
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });
});

/** Tags les plus utilisés. */
export const getTrendingTags = cache(async (limit = 10) => {
  return prisma.tag.findMany({
    where: { isTrending: true },
    select: { id: true, slug: true, name: true, usageCount: true },
    orderBy: { usageCount: 'desc' },
    take: limit,
  });
});

/** Émissions de podcast avec leurs derniers épisodes. */
export const getPodcastShows = cache(async (limit = 4) => {
  return prisma.podcastShow.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      tagline: true,
      description: true,
      hostName: true,
      category: true,
      episodeCount: true,
      cover: { select: { url: true, altText: true } },
      episodes: {
        select: { id: true, slug: true, title: true, durationSeconds: true, publishedAt: true },
        orderBy: { publishedAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { episodeCount: 'desc' },
    take: limit,
  });
});

/** Vidéos récentes. */
export const getVideos = cache(async (limit = 6) => {
  return prisma.video.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      durationSeconds: true,
      isLive: true,
      viewCount: true,
      publishedAt: true,
      thumbnail: { select: { url: true, altText: true } },
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });
});

/** Bandeau publicitaire actif pour un emplacement donné. */
export const getAdSlot = cache(async (placement: string) => {
  return prisma.adSlot.findFirst({
    where: { placement: placement as never, isActive: true },
    select: { id: true, name: true, imageUrl: true, targetUrl: true, htmlSnippet: true },
  });
});

/** Formules d'abonnement. */
export const getSubscriptionPlans = cache(async () => {
  return prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { position: 'asc' },
  });
});

/** Articles liés : même catégorie, hors article courant. */
export const getRelatedArticles = cache(async (categoryId: string, excludeId: string, limit = 3) => {
  return prisma.article.findMany({
    where: {
      status: 'PUBLISHED' as ArticleStatus,
      deletedAt: null,
      categoryId,
      id: { not: excludeId },
    },
    select: CARD_SELECT,
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });
});

/** Profil d'un journaliste avec ses publications. */
export const getAuthorBySlug = cache(async (slug: string) => {
  return prisma.authorProfile.findUnique({
    where: { slug },
    include: {
      user: {
        select: { id: true, displayName: true, name: true, image: true, email: true, bio: true, role: true },
      },
    },
  });
});

export const getCategoriesWithCounts = cache(async () => {
  return prisma.category.findMany({
    where: { parentId: null, isActive: true },
    select: {
      id: true,
      slug: true,
      name: true,
      shortName: true,
      description: true,
      accent: true,
      _count: { select: { articles: true } },
    },
    orderBy: { position: 'asc' },
  });
});

export { CARD_SELECT };
export type { ArticleFormat, ArticleStatus };

export interface SearchArticleHit {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  isPremium: boolean;
  readingMinutes: number;
  viewCount: number;
  publishedAt: Date | null;
  categorySlug: string | null;
  categoryName: string | null;
  categoryShortName: string | null;
  categoryAccent: string | null;
  heroImageUrl: string | null;
  heroImageThumbnail: string | null;
  heroImageAlt: string | null;
  authorName: string | null;
  authorImage: string | null;
}

export interface SearchArticleOptions {
  query: string;
  categorySlug?: string;
  sort?: 'pertinence' | 'recent';
  limit?: number;
}

/**
 * Recherche éditoriale côté site public.
 *
 * Le classement pondéré (titre > chapô > corps) et l'insensibilité aux accents
 * ne sont pas exprimables avec l'API Prisma : la requête est donc écrite en SQL
 * paramétré, ce qui évite toute interpolation de chaîne dans la requête.
 */
export const searchArticles = cache(async (options: SearchArticleOptions) => {
  const { query, categorySlug, sort = 'pertinence', limit = 20 } = options;
  const term = query.trim();
  if (term.length < 2) return { items: [] as SearchArticleHit[], total: 0 };

  const pattern = `%${term}%`;
  const categoryFilter = categorySlug ? Prisma.sql`AND c."slug" = ${categorySlug}` : Prisma.empty;

  const matches = Prisma.sql`
    a."status" = ${'PUBLISHED' as ArticleStatus}::"ArticleStatus"
    AND a."deletedAt" IS NULL
    AND a."publishedAt" <= now()
    ${categoryFilter}
    AND (
      ${normalize(Prisma.sql`a."title"`)} LIKE ${normalizePattern(pattern)}
      OR ${normalize(Prisma.sql`a."subtitle"`)} LIKE ${normalizePattern(pattern)}
      OR ${normalize(Prisma.sql`a."excerpt"`)} LIKE ${normalizePattern(pattern)}
      OR ${normalize(Prisma.sql`a."bodyText"`)} LIKE ${normalizePattern(pattern)}
      OR EXISTS (
        SELECT 1 FROM "article_tags" at
        JOIN "tags" t ON t."id" = at."tagId"
        WHERE at."articleId" = a."id"
          AND ${normalize(Prisma.sql`t."name"`)} LIKE ${normalizePattern(pattern)}
      )
    )
  `;

  const [rows, totalRows] = await Promise.all([
    prisma.$queryRaw<SearchArticleHit[]>(Prisma.sql`
      SELECT
        a."id",
        a."slug",
        a."title",
        a."excerpt",
        a."isPremium",
        a."readingMinutes",
        a."viewCount",
        a."publishedAt",
        c."slug" AS "categorySlug",
        c."name" AS "categoryName",
        c."shortName" AS "categoryShortName",
        c."accent" AS "categoryAccent",
        m."url" AS "heroImageUrl",
        m."thumbnailUrl" AS "heroImageThumbnail",
        m."altText" AS "heroImageAlt",
        u."displayName" AS "authorName",
        u."image" AS "authorImage"
      FROM "articles" a
      LEFT JOIN "categories" c ON c."id" = a."categoryId"
      LEFT JOIN "media" m ON m."id" = a."heroImageId"
      LEFT JOIN "article_authors" aa ON aa."articleId" = a."id" AND aa."position" = 0
      LEFT JOIN "users" u ON u."id" = aa."userId"
      WHERE ${matches}
      ORDER BY
        ${
          sort === 'recent'
            ? Prisma.sql`a."publishedAt" DESC`
            : Prisma.sql`(
                CASE WHEN ${normalize(Prisma.sql`a."title"`)} LIKE ${normalizePattern(pattern)} THEN 3 ELSE 0 END
                + CASE WHEN ${normalize(Prisma.sql`a."excerpt"`)} LIKE ${normalizePattern(pattern)} THEN 2 ELSE 0 END
                + CASE WHEN ${normalize(Prisma.sql`a."bodyText"`)} LIKE ${normalizePattern(pattern)} THEN 1 ELSE 0 END
              ) DESC, a."viewCount" DESC`
        }
      LIMIT ${limit}
    `),
    prisma.$queryRaw<Array<{ count: bigint }>>(Prisma.sql`
      SELECT COUNT(*)::bigint AS "count"
      FROM "articles" a
      LEFT JOIN "categories" c ON c."id" = a."categoryId"
      WHERE ${matches}
    `),
  ]);

  return { items: rows, total: Number(totalRows[0]?.count ?? 0) };
});

/** Rubriques proposées comme filtre sur la page de résultats. */
export const getSearchCategories = cache(async () => {
  return prisma.category.findMany({
    where: { parentId: null, isActive: true },
    select: { slug: true, name: true },
    orderBy: { position: 'asc' },
  });
});
