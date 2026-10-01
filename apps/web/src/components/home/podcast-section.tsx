import Link from 'next/link';
import Image from 'next/image';
import { Radio, Clock } from 'lucide-react';
import { formatClock } from '@/lib/format';

interface Episode {
  id: string;
  slug: string;
  title: string;
  durationSeconds: number | null;
  publishedAt: Date | null;
}

interface Show {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  hostName: string | null;
  category: string | null;
  episodeCount: number;
  cover: { url: string; altText: string | null } | null;
  episodes: Episode[];
}

export function PodcastSection({ shows }: { shows: Show[] }) {
  if (shows.length === 0) return null;

  return (
    <section
      className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8"
      aria-labelledby="podcasts-title"
    >
      <div className="mb-5 flex items-end justify-between gap-4 border-b-2 border-neutral-900 pb-2 dark:border-neutral-100">
        <h2
          id="podcasts-title"
          className="font-display text-xl font-extrabold uppercase tracking-tight sm:text-2xl"
        >
          <span
            className="bg-sn-yellow mr-2 inline-block h-4 w-1.5 translate-y-[1px] rounded-sm align-middle"
            aria-hidden
          />
          Podcasts
        </h2>
        <Link
          href="/podcasts"
          className="text-sn-green dark:text-sn-green-400 shrink-0 text-xs font-semibold uppercase tracking-wide hover:underline"
        >
          Toutes les émissions →
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {shows.map((show) => (
          <article
            key={show.id}
            className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-shadow hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
          >
            <Link
              href={`/podcasts/${show.slug}`}
              className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800"
            >
              {show.cover && (
                <Image
                  src={show.cover.url}
                  alt={show.cover.altText ?? show.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <span className="font-ui absolute bottom-2 left-2 rounded-sm bg-black/75 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                {show.episodeCount} épisodes
              </span>
            </Link>

            <div className="flex flex-1 flex-col p-4">
              {show.category && (
                <span className="font-ui text-sn-yellow-700 dark:text-sn-yellow-500 text-[11px] font-bold uppercase tracking-wider">
                  {show.category}
                </span>
              )}
              <h3 className="font-display mt-1 text-base font-bold leading-snug">
                <Link
                  href={`/podcasts/${show.slug}`}
                  className="hover:text-sn-green dark:hover:text-sn-green-400"
                >
                  {show.name}
                </Link>
              </h3>
              {show.tagline && (
                <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {show.tagline}
                </p>
              )}

              {show.episodes[0] && (
                <div className="mt-3 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                  <p className="line-clamp-2 text-xs font-medium leading-snug text-neutral-700 dark:text-neutral-300">
                    {show.episodes[0].title}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] text-neutral-500">
                    <Clock className="h-3 w-3" aria-hidden />
                    {formatClock(show.episodes[0].durationSeconds)}
                    {show.hostName && <span className="truncate">· {show.hostName}</span>}
                  </p>
                </div>
              )}

              <button
                type="button"
                className="hover:bg-sn-green dark:hover:bg-sn-green mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-neutral-900 px-3 py-2 text-xs font-semibold text-white transition-colors dark:bg-neutral-100 dark:text-neutral-900 dark:hover:text-white"
              >
                <Radio className="h-3.5 w-3.5" aria-hidden />
                Écouter l&apos;émission
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
