import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Radio, Calendar, Eye, Video } from 'lucide-react';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';
import { getVideos } from '@/lib/queries';
import { formatClock, formatCompactNumber, timeAgo } from '@/lib/format';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'TV en direct',
  description:
    'Suivez SENCOURRIER TV en direct : journaux, débats, reportages et éditions spéciales consacrées à l’actualité sénégalaise.',
  alternates: { canonical: '/tv-live' },
  openGraph: { type: 'website', title: 'TV en direct — SENCOURRIER', url: '/tv-live' },
};

export default async function TvLivePage() {
  const videos = await getVideos(12);
  const [live, ...replays] = videos;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          { name: 'TV en direct', url: '/tv-live' },
        ])}
      />

      <div className="border-b border-neutral-200 bg-neutral-900 dark:border-neutral-800">
        <div className="mx-auto max-w-screen-2xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-sn-red font-ui flex items-center gap-2 rounded-sm px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" aria-hidden />
              En direct
            </span>
            <h1 className="font-display text-lg font-extrabold tracking-tight text-white sm:text-xl">
              SENCOURRIER TV
            </h1>
            <span className="ml-auto text-xs text-neutral-400">
              Flux continu 24 h / 24 — journaux, débats et reportages
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {/* Lecteur principal */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-900">
              {live?.thumbnail ? (
                <Image
                  src={live.thumbnail.url}
                  alt={live.thumbnail.altText ?? 'Flux en direct SENCOURRIER TV'}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="h-full w-full object-cover opacity-70"
                />
              ) : null}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-2xl">
                  <svg viewBox="0 0 24 24" className="fill-sn-green ml-1 h-9 w-9" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <p className="font-display mt-4 text-lg font-bold text-white">
                  {live?.title ?? 'Le direct commence bientôt'}
                </p>
                <p className="mt-1 max-w-md text-xs text-white/70">
                  Le flux vidéo est diffusé via Azure Media Services et le CDN Cloudflare.
                </p>
              </div>
            </div>

            {live && (
              <div className="mt-5">
                <h2 className="font-display text-xl font-extrabold tracking-tight">{live.title}</h2>
                {live.description && (
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {live.description}
                  </p>
                )}
                <p className="mt-3 flex items-center gap-4 text-xs text-neutral-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" aria-hidden />
                    {formatCompactNumber(live.viewCount)} spectateurs
                  </span>
                  {live.publishedAt && (
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" aria-hidden />
                      {timeAgo(live.publishedAt)}
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Grille de rediffusions */}
            <section className="mt-10" aria-labelledby="replays-title">
              <h2
                id="replays-title"
                className="font-display mb-5 border-b-2 border-neutral-900 pb-2 text-lg font-extrabold uppercase tracking-tight dark:border-neutral-100"
              >
                Rediffusions
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {replays.map((video) => (
                  <article key={video.id} className="group">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                      {video.thumbnail && (
                        <Image
                          src={video.thumbnail.url}
                          alt={video.thumbnail.altText ?? video.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <span className="font-ui absolute bottom-2 right-2 rounded-sm bg-black/80 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white">
                        {formatClock(video.durationSeconds)}
                      </span>
                    </div>
                    <h3 className="mt-2.5 line-clamp-2 text-sm font-semibold leading-snug">
                      {video.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-neutral-500">
                      {formatCompactNumber(video.viewCount)} vues
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* Colonne latérale : programmes */}
          <aside className="lg:col-span-4">
            <section className="sticky top-24 rounded-lg border border-neutral-200 p-5 dark:border-neutral-800">
              <h2 className="font-ui flex items-center gap-2 border-b border-neutral-200 pb-3 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:border-neutral-800">
                <Radio className="text-sn-red h-4 w-4" aria-hidden />
                Grille des programmes
              </h2>
              <ul className="mt-4 space-y-3">
                {[
                  { time: '07:00', title: 'Le journal du matin', duration: '30 min' },
                  { time: '12:30', title: 'Édition de la mi-journée', duration: '45 min' },
                  { time: '18:00', title: 'Le Débrief', duration: '60 min' },
                  { time: '20:00', title: 'Le journal du soir', duration: '45 min' },
                  { time: '21:30', title: 'Grand Format', duration: '52 min' },
                ].map((slot) => (
                  <li key={slot.time} className="flex items-start gap-3">
                    <span className="font-display text-sn-green dark:text-sn-green-400 w-12 shrink-0 text-sm font-bold tabular-nums">
                      {slot.time}
                    </span>
                    <span>
                      <span className="block text-sm font-medium">{slot.title}</span>
                      <span className="block text-[11px] text-neutral-500">{slot.duration}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/videos"
                className="hover:border-sn-green hover:text-sn-green mt-5 flex items-center justify-center gap-2 rounded-md border border-neutral-300 px-4 py-2.5 text-xs font-semibold transition-colors dark:border-neutral-700"
              >
                <Video className="h-3.5 w-3.5" aria-hidden />
                Toutes nos vidéos
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
