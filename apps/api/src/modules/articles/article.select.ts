import { Prisma } from '@sencourrier/database';

/**
 * Projection commune d'un article en « carte » (listes, fils, widgets).
 *
 * Le web consomme toujours la même forme : les auteurs sont aplatis depuis la
 * table de liaison `article_authors` et les tags depuis `article_tags`. Cette
 * projection unique évite que chaque service redéfinisse la sienne et divergé.
 */
export const ARTICLE_CARD_SELECT = {
  id: true,
  slug: true,
  title: true,
  subtitle: true,
  excerpt: true,
  format: true,
  isPremium: true,
  isBreaking: true,
  isFeatured: true,
  readingMinutes: true,
  publishedAt: true,
  updatedAt: true,
  ogImageUrl: true,
  category: { select: { slug: true, name: true, accent: true } },
  heroImage: { select: { url: true, altText: true, width: true, height: true, blurDataUrl: true } },
  authors: {
    select: {
      position: true,
      role: true,
      user: {
        select: {
          authorProfile: {
            select: { slug: true, displayName: true, avatarUrl: true, jobTitle: true },
          },
        },
      },
    },
  },
  tags: { select: { tag: { select: { slug: true, name: true } } } },
} satisfies Prisma.ArticleSelect;

export type ArticleCardRow = {
  authors: Array<{
    position: number;
    role: string | null;
    user: {
      authorProfile: {
        slug: string;
        displayName: string;
        avatarUrl: string | null;
        jobTitle: string | null;
      } | null;
    };
  }>;
  tags: Array<{ tag: { slug: string; name: string } }>;
} & Record<string, unknown>;

/** Aplatit les relations de jointure vers la forme consommée par le front. */
export function toArticleCard(row: ArticleCardRow) {
  const authors = row.authors
    .slice()
    .sort((a, b) => a.position - b.position)
    .flatMap((entry) => (entry.user.authorProfile ? [entry.user.authorProfile] : []));

  return { ...row, authors, tags: row.tags.map((entry) => entry.tag) };
}
