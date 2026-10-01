/**
 * Exporte un instantané des données éditoriales vers l'application d'aperçu
 * statique (`apps/showcase`).
 *
 * L'aperçu publié sur GitHub Pages ne peut pas interroger PostgreSQL : les
 * données sont figées ici, au moment de la construction, puis servies comme
 * fichiers statiques. Le contenu reste donc celui du jeu de démonstration réel.
 *
 * Usage : tsx scripts/export-showcase-data.ts
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { prisma } from '@sencourrier/database';

const OUTPUT = resolve(__dirname, '../apps/showcase/src/data/snapshot.json');

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
  heroImage: {
    select: { url: true, thumbnailUrl: true, altText: true, width: true, height: true },
  },
  authors: {
    select: {
      position: true,
      role: true,
      user: { select: { id: true, displayName: true, name: true, image: true } },
    },
    orderBy: { position: 'asc' as const },
  },
} as const;

/** Rubriques mises en avant sur la page d'accueil, dans l'ordre éditorial. */
const SECTIONS = [
  'politique',
  'societe',
  'economie',
  'sports',
  'technologies',
  'international',
  'diaspora',
  'faits-divers',
];

async function main() {
  const published = { status: 'PUBLISHED' as const, deletedAt: null };

  const [
    lead,
    secondary,
    breaking,
    latest,
    tags,
    podcasts,
    videos,
    ad,
    categories,
    plans,
    featured,
  ] = await Promise.all([
    prisma.article.findFirst({
      where: { ...published, publishedAt: { lte: new Date() } },
      orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
      select: CARD_SELECT,
    }),
    prisma.article.findMany({
      where: { ...published, publishedAt: { lte: new Date() } },
      orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
      select: CARD_SELECT,
      skip: 1,
      take: 4,
    }),
    prisma.article.findMany({
      where: { ...published, isBreaking: true },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        publishedAt: true,
        category: { select: { slug: true, name: true, accent: true } },
      },
      take: 6,
    }),
    prisma.article.findMany({
      where: { ...published, publishedAt: { gte: new Date(Date.now() - 24 * 3600 * 1000) } },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        publishedAt: true,
        category: { select: { slug: true, name: true, accent: true } },
      },
      take: 8,
    }),
    prisma.tag.findMany({
      where: { isTrending: true },
      select: { id: true, slug: true, name: true, usageCount: true },
      orderBy: { usageCount: 'desc' },
      take: 10,
    }),
    prisma.podcastShow.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        tagline: true,
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
      take: 4,
    }),
    prisma.video.findMany({
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
      take: 6,
    }),
    prisma.adSlot.findFirst({
      where: { isActive: true },
      select: { id: true, name: true, imageUrl: true, targetUrl: true, htmlSnippet: true },
    }),
    prisma.category.findMany({
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
    }),
    prisma.subscriptionPlan.findMany({ where: { isActive: true }, orderBy: { position: 'asc' } }),
    prisma.article.findMany({
      where: { ...published, isFeatured: true },
      orderBy: { publishedAt: 'desc' },
      select: CARD_SELECT,
      take: 5,
    }),
  ]);

  // Une section par grande rubrique, alimentée par ses articles les plus récents.
  const sections = await Promise.all(
    SECTIONS.map(async (slug) => {
      const category = await prisma.category.findUnique({
        where: { slug },
        select: { id: true, slug: true, name: true, accent: true },
      });
      if (!category) return null;
      const articles = await prisma.article.findMany({
        where: { ...published, category: { slug } },
        orderBy: { publishedAt: 'desc' },
        select: CARD_SELECT,
        take: 4,
      });
      return { ...category, articles };
    }),
  );

  // Article de démonstration : le contenu intégral de la une.
  const articleSlug = lead?.slug;
  const article = articleSlug
    ? await prisma.article.findUnique({
        where: { slug: articleSlug },
        select: {
          ...CARD_SELECT,
          bodyHtml: true,
          tags: { select: { tag: { select: { id: true, slug: true, name: true } } } },
        },
      })
    : null;

  const related = article
    ? await prisma.article.findMany({
        where: {
          ...published,
          categoryId: article.category?.id ?? undefined,
          id: { not: article.id },
        },
        orderBy: { publishedAt: 'desc' },
        select: CARD_SELECT,
        take: 3,
      })
    : [];

  const snapshot = {
    generatedAt: new Date().toISOString(),
    lead,
    secondary,
    featured,
    breaking,
    latest,
    tags,
    podcasts,
    videos,
    ad,
    categories,
    plans,
    sections: sections.filter(Boolean),
    article,
    related,
  };

  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');

  const articles = await prisma.article.count();
  console.log(
    `[showcase] instantané écrit : ${OUTPUT}\n` +
      `  articles ${articles} · sections ${snapshot.sections.length} · ` +
      `podcasts ${podcasts.length} · vidéos ${videos.length} · tags ${tags.length}`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error('[showcase] échec de l’export', error);
    await prisma.$disconnect();
    process.exit(1);
  });
