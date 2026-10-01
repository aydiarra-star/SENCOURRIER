import { Suspense } from 'react';
import Link from 'next/link';
import { Crown, ShieldCheck, Zap, Radio } from 'lucide-react';
import { ArticleCard } from '@/components/news/article-card';
import { AdSlot } from '@/components/news/ad-slot';
import { PodcastSection } from '@/components/home/podcast-section';
import { VideoSection } from '@/components/home/video-section';
import { LatestUpdates } from '@/components/home/latest-updates';
import { TrendingTopics } from '@/components/home/trending-topics';
import { NewsletterSignup } from '@/components/home/newsletter-signup';
import { JsonLd, organizationSchema, websiteSchema, itemListSchema } from '@/components/seo/json-ld';
import {
  getLeadArticle,
  getArticleCards,
  getTrendingTags,
  getPodcastShows,
  getVideos,
  getAdSlot,
  getCategoriesWithCounts,
} from '@/lib/queries';

export const dynamic = 'force-dynamic';
// La page d'accueil est régénérée toutes les 60 secondes (ISR) : les lecteurs
// voient une version mise en cache servie par le CDN, jamais un rendu à froid.

/** Rubriques affichées en sections thématiques sur la page d'accueil. */
const HOME_SECTIONS = [
  { slug: 'politique', accent: 'sn-green' },
  { slug: 'economie', accent: 'sn-yellow' },
  { slug: 'societe', accent: 'sn-green' },
  { slug: 'sports', accent: 'sn-red' },
  { slug: 'international', accent: 'sn-green' },
  { slug: 'technologies', accent: 'sn-yellow' },
  { slug: 'diaspora', accent: 'sn-green' },
  { slug: 'faits-divers', accent: 'sn-red' },
];

export default async function HomePage() {
  const [lead, latest, shows, videos, leaderboard, footerAd, categories, tagList] = await Promise.all([
    getLeadArticle(),
    getArticleCards({ limit: 4 }),
    getPodcastShows(4),
    getVideos(6),
    getAdSlot('HEADER_LEADERBOARD'),
    getAdSlot('FOOTER'),
    getCategoriesWithCounts(),
    getTrendingTags(10),
  ]);

  // Une requête par rubrique affichée en section.
  const sectionArticles = await Promise.all(
    HOME_SECTIONS.map((section) => getArticleCards({ categorySlug: section.slug, limit: 4 })),
  );

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      {latest.length > 0 && <JsonLd data={itemListSchema(latest)} />}

      <div className="mx-auto max-w-screen-2xl px-4 pt-4 sm:px-6 lg:px-8">
        <AdSlot slot={leaderboard} format="leaderboard" className="mb-6" />
      </div>

      {/* ── UNE ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-screen-2xl px-4 pb-8 sm:px-6 lg:px-8" aria-labelledby="une-title">
        <h1 id="une-title" className="sr-only">
          À la une — SENCOURRIER, l&apos;actualité du Sénégal
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Article principal */}
          <div className="lg:col-span-2">
            {lead ? (
              <ArticleCard article={lead} variant="hero" priority showExcerpt={false} />
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 dark:bg-neutral-900">
                Aucun article publié pour le moment.
              </div>
            )}
          </div>

          {/* Actualités secondaires + fil des dernières minutes */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
              {latest.map((article) => (
                <ArticleCard key={article.id} article={article} variant="compact" className="py-4 first:pt-0" />
              ))}
            </div>
            <LatestUpdates updates={latest} />
          </div>
        </div>
      </section>

      {/* ── BARRE DE CONFIANCE ──────────────────────────────────────────── */}
      <section className="border-y border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="mx-auto grid max-w-screen-2xl gap-4 px-4 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { icon: ShieldCheck, label: 'Information vérifiée', detail: 'Double source systématique' },
            { icon: Zap, label: 'Temps réel', detail: 'Fil d’actualité continu' },
            { icon: Radio, label: 'TV & podcasts', detail: 'Production propre' },
            { icon: Crown, label: 'Premium', detail: 'Enquêtes exclusives' },
          ].map(({ icon: Icon, label, detail }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="h-5 w-5 shrink-0 text-sn-green" aria-hidden />
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTIONS THÉMATIQUES ────────────────────────────────────────── */}
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {HOME_SECTIONS.map((section, index) => {
          const articles = sectionArticles[index] ?? [];
          const category = categories.find((c) => c.slug === section.slug);
          if (!category || articles.length === 0) return null;

          return (
            <section key={section.slug} className="py-10" aria-labelledby={`section-${section.slug}`}>
              <div className="mb-5 flex items-end justify-between gap-4 border-b-2 border-neutral-900 pb-2 dark:border-neutral-100">
                <h2
                  id={`section-${section.slug}`}
                  className="font-display text-xl font-extrabold uppercase tracking-tight sm:text-2xl"
                >
                  <span
                    className={`mr-2 inline-block h-4 w-1.5 translate-y-[1px] rounded-sm align-middle ${
                      section.accent === 'sn-red'
                        ? 'bg-sn-red'
                        : section.accent === 'sn-yellow'
                          ? 'bg-sn-yellow'
                          : 'bg-sn-green'
                    }`}
                    aria-hidden
                  />
                  {category.name}
                </h2>
                <Link
                  href={`/${category.slug}`}
                  className="shrink-0 text-xs font-semibold uppercase tracking-wide text-sn-green hover:underline dark:text-sn-green-400"
                >
                  Tout voir →
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {articles.map((article, i) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant={i === 0 ? 'featured' : 'standard'}
                    className={i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* ── PODCASTS ────────────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        <PodcastSection shows={shows} />
      </Suspense>

      {/* ── VIDÉOS ──────────────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        <VideoSection videos={videos} />
      </Suspense>

      {/* ── NEWSLETTER + TENDANCES ──────────────────────────────────────── */}
      <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <NewsletterSignup />
          </div>
          <TrendingTopics tags={tagList} />
        </div>
      </div>

      {/* ── PUBLICITÉ PIED DE PAGE ──────────────────────────────────────── */}
      <div className="mx-auto max-w-screen-2xl px-4 pb-8 sm:px-6 lg:px-8">
        <AdSlot slot={footerAd} format="footer" />
      </div>
    </>
  );
}
