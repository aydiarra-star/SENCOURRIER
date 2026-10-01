import type { Metadata } from 'next';
import Image from 'next/image';
import { Radio, Clock, Users, Calendar } from 'lucide-react';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';
import { getPodcastShows } from '@/lib/queries';
import { formatClock, timeAgo } from '@/lib/format';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Podcasts',
  description:
    "Toutes les émissions de podcast de SENCOURRIER : Le Débrief, Grand Format, Teranga Tech et Les Lions. L'actualité sénégalaise à écouter.",
  alternates: { canonical: '/podcasts' },
  openGraph: { type: 'website', title: 'Podcasts — SENCOURRIER', url: '/podcasts' },
};

export default async function PodcastsPage() {
  const shows = await getPodcastShows(20);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          { name: 'Podcasts', url: '/podcasts' },
        ])}
      />

      <div className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="font-ui text-sn-yellow-700 dark:text-sn-yellow-500 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <Radio className="h-4 w-4" aria-hidden />
            Audio
          </p>
          <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Podcasts
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Les émissions de la rédaction, à écouter quand vous voulez. Débats, enquêtes et
            entretiens de fond sur l&apos;actualité sénégalaise et africaine.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {shows.map((show) => (
            <section
              key={show.id}
              className="grid gap-6 rounded-xl border border-neutral-200 p-6 lg:grid-cols-[240px_1fr] dark:border-neutral-800"
              aria-labelledby={`show-${show.slug}`}
            >
              <div className="relative aspect-square w-full max-w-[240px] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                {show.cover && (
                  <Image
                    src={show.cover.url}
                    alt={show.cover.altText ?? show.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div>
                {show.category && (
                  <span className="font-ui text-sn-yellow-700 dark:text-sn-yellow-500 text-[11px] font-bold uppercase tracking-wider">
                    {show.category}
                  </span>
                )}
                <h2
                  id={`show-${show.slug}`}
                  className="font-display mt-1 text-2xl font-extrabold tracking-tight"
                >
                  {show.name}
                </h2>
                {show.tagline && (
                  <p className="mt-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {show.tagline}
                  </p>
                )}
                {show.description && (
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {show.description}
                  </p>
                )}

                <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" aria-hidden />
                    <dt className="sr-only">Présentateur</dt>
                    <dd>{show.hostName}</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Radio className="h-3.5 w-3.5" aria-hidden />
                    <dt className="sr-only">Nombre d&apos;épisodes</dt>
                    <dd>{show.episodeCount} épisodes</dd>
                  </div>
                </dl>

                {show.episodes.length > 0 && (
                  <ul className="mt-5 divide-y divide-neutral-200 border-t border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
                    {show.episodes.map((episode) => (
                      <li key={episode.id} className="flex items-center gap-4 py-3">
                        <span className="bg-sn-green flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white">
                          <svg
                            viewBox="0 0 24 24"
                            className="ml-0.5 h-3.5 w-3.5 fill-current"
                            aria-hidden
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{episode.title}</p>
                          <p className="mt-0.5 flex items-center gap-2 text-[11px] text-neutral-500">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" aria-hidden />
                              {formatClock(episode.durationSeconds)}
                            </span>
                            {episode.publishedAt && (
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="h-3 w-3" aria-hidden />
                                {timeAgo(episode.publishedAt)}
                              </span>
                            )}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
