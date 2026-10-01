import type { MetadataRoute } from 'next';
import { SITE_URL } from '@sencourrier/config';
import { prisma } from '@/lib/db';

const siteUrl = SITE_URL;

// Le sitemap doit refléter les publications dès leur mise en ligne : il est
// produit à chaque requête, jamais figé au moment de la construction de
// l'image (où la base n'est d'ailleurs pas joignable).
export const dynamic = 'force-dynamic';

/**
 * Sitemap principal.
 * Les articles sont limités aux 5 000 plus récents : au-delà, Google privilégie
 * le sitemap d'actualités et les archives paginées.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, authors, tags] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: 'desc' },
      take: 5000,
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, parent: { select: { slug: true } }, updatedAt: true },
    }),
    prisma.authorProfile.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.tag.findMany({
      where: { usageCount: { gte: 3 } },
      select: { slug: true },
    }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'hourly', priority: 1 },
    { url: `${siteUrl}/dernieres-minutes`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${siteUrl}/tv-live`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/videos`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/podcasts`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/abonnement`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/a-propos`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${siteUrl}/newsletter`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/mentions-legales`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${siteUrl}/politique-confidentialite`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${siteUrl}/cgu`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${siteUrl}/cgv`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  return [
    ...staticPages,
    ...categories.map((category) => ({
      url: `${siteUrl}/${category.parent ? `${category.parent.slug}/` : ''}${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...articles.map((article) => ({
      url: `${siteUrl}/article/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...authors.map((author) => ({
      url: `${siteUrl}/journaliste/${author.slug}`,
      lastModified: author.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
    ...tags.map((tag) => ({
      url: `${siteUrl}/tag/${tag.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    })),
  ];
}
