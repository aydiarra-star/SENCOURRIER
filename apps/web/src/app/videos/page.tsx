import type { Metadata } from 'next';
import Image from 'next/image';
import { Radio, Calendar } from 'lucide-react';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';
import { getVideos } from '@/lib/queries';
import { formatClock, formatCompactNumber, timeAgo } from '@/lib/format';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Vidéos',
  description:
    'Reportages, entretiens, débats et journaux télévisés de la rédaction SENCOURRIER, en vidéo.',
  alternates: { canonical: '/videos' },
  openGraph: { type: 'website', title: 'Vidéos — SENCOURRIER', url: '/videos' },
};

export default async function VideosPage() {
  const videos = await getVideos(24);

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', url: '/' }, { name: 'Vidéos', url: '/videos' }])} />

      <div className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="flex items-center gap-2 font-ui text-xs font-bold uppercase tracking-wider text-sn-red">
            <Radio className="h-4 w-4" aria-hidden />
            Vidéo
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Vidéos</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Reportages de terrain, entretiens avec les décideurs, débats économiques et éditions
            du journal télévisé.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <article key={video.id} className="group">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                {video.thumbnail && (
                  <Image src={video.thumbnail.url} alt={video.thumbnail.altText ?? video.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/15 transition-colors group-hover:bg-black/30">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95">
                    <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-sn-green" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
                <span className="absolute bottom-2 right-2 rounded-sm bg-black/80 px-2 py-0.5 font-ui text-[11px] font-semibold tabular-nums text-white">
                  {formatClock(video.durationSeconds)}
                </span>
              </div>

              <h2 className="mt-3 line-clamp-2 font-display text-base font-bold leading-snug">
                {video.title}
              </h2>
              {video.description && (
                <p className="mt-1.5 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {video.description}
                </p>
              )}
              <p className="mt-2 flex items-center gap-3 text-xs text-neutral-500">
                <span>{formatCompactNumber(video.viewCount)} vues</span>
                {video.publishedAt && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" aria-hidden />
                    {timeAgo(video.publishedAt)}
                  </span>
                )}
              </p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
