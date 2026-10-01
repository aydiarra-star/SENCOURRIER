import Link from 'next/link';
import { Crown, ShieldCheck, Zap, Radio } from 'lucide-react';
import { ArticleCard } from '@/components/news/article-card';
import { AdSlot } from '@/components/news/ad-slot';
import { PodcastSection } from '@/components/home/podcast-section';
import { VideoSection } from '@/components/home/video-section';
import { LatestUpdates } from '@/components/home/latest-updates';
import { TrendingTopics } from '@/components/home/trending-topics';
import { NewsletterSignup } from '@/components/home/newsletter-signup';
import {
  JsonLd,
  organizationSchema,
  websiteSchema,
  itemListSchema,
} from '@/components/seo/json-ld';
import { articles, taxonomy, media, commerce } from '@/lib/data';

/** Accent éditorial par rubrique, comme sur le portail complet. */
const ACCENTS: Record<string, 'sn-green' | 'sn-yellow' | 'sn-red'> = {
  politique: 'sn-green',
  economie: 'sn-yellow',
  societe: 'sn-green',
  sports: 'sn-red',
  international: 'sn-green',
  technologies: 'sn-yellow',
  diaspora: 'sn-green',
  'faits-divers': 'sn-red',
};

export default function HomePage() {
  const sections = articles.sections.filter((section) => section.articles.length > 0);

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      {articles.latest.length > 0 && <JsonLd data={itemListSchema(articles.latest)} />}

      <div className="mx-auto max-w-screen-2xl px-4 pt-4 sm:px-6 lg:px-8">
        <AdSlot slot={media.ad} format="leaderboard" className="mb-6" />
      </div>

      {/* ── UNE ─────────────────────────────────────────────────────────── */}
      <section
        className="mx-auto max-w-screen-2xl px-4 pb-8 sm:px-6 lg:px-8"
        aria-labelledby="une-title"
      >
        <h1 id="une-title" className="sr-only">
          À la une — SENCOURRIER, l&apos;actualité du Sénégal
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {articles.lead && (
              <ArticleCard article={articles.lead} variant="hero" priority showExcerpt={false} />
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
              {articles.secondary.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="compact"
                  className="py-4 first:pt-0"
                />
              ))}
            </div>
            <LatestUpdates updates={articles.latest} />
          </div>
        </div>
      </section>

      {/* ── BARRE DE CONFIANCE ──────────────────────────────────────────── */}
      <section className="border-y border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="mx-auto grid max-w-screen-2xl gap-4 px-4 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            {
              icon: ShieldCheck,
              label: 'Information vérifiée',
              detail: 'Double source systématique',
            },
            { icon: Zap, label: 'Temps réel', detail: 'Fil d’actualité continu' },
            { icon: Radio, label: 'TV & podcasts', detail: 'Production propre' },
            { icon: Crown, label: 'Premium', detail: 'Enquêtes exclusives' },
          ].map(({ icon: Icon, label, detail }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="text-sn-green h-5 w-5 shrink-0" aria-hidden />
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
        {sections.map((section) => {
          const accent = ACCENTS[section.slug] ?? 'sn-green';
          return (
            <section
              key={section.slug}
              className="py-10"
              aria-labelledby={`section-${section.slug}`}
            >
              <div className="mb-5 flex items-end justify-between gap-4 border-b-2 border-neutral-900 pb-2 dark:border-neutral-100">
                <h2
                  id={`section-${section.slug}`}
                  className="font-display text-xl font-extrabold uppercase tracking-tight sm:text-2xl"
                >
                  <span
                    className={`mr-2 inline-block h-4 w-1.5 translate-y-[1px] rounded-sm align-middle ${
                      accent === 'sn-red'
                        ? 'bg-sn-red'
                        : accent === 'sn-yellow'
                          ? 'bg-sn-yellow'
                          : 'bg-sn-green'
                    }`}
                    aria-hidden
                  />
                  {section.name}
                </h2>
                <Link
                  href={`/rubrique/${section.slug}`}
                  className="text-sn-green dark:text-sn-green-400 shrink-0 text-xs font-semibold uppercase tracking-wide hover:underline"
                >
                  Tout voir →
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {section.articles.map((article, index) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant={index === 0 ? 'featured' : 'standard'}
                    className={index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <PodcastSection shows={media.podcasts} />
      <VideoSection videos={media.videos} />

      <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <NewsletterSignup />
          </div>
          <TrendingTopics tags={taxonomy.tags} />
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 pb-8 sm:px-6 lg:px-8">
        <AdSlot slot={media.ad} format="footer" />
      </div>
    </>
  );
}
