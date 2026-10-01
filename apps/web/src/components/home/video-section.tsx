import Link from 'next/link';
import Image from 'next/image';
import { Play, Radio, Eye } from 'lucide-react';
import { formatClock, formatCompactNumber, timeAgo } from '@/lib/format';

interface VideoItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  durationSeconds: number | null;
  isLive: boolean;
  viewCount: number;
  publishedAt: Date | null;
  thumbnail: { url: string; altText: string | null } | null;
}

export function VideoSection({ videos }: { videos: VideoItem[] }) {
  if (videos.length === 0) return null;

  const [lead, ...rest] = videos as [VideoItem, ...VideoItem[]];

  return (
    <section
      className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8"
      aria-labelledby="videos-title"
    >
      <div className="mb-5 flex items-end justify-between gap-4 border-b-2 border-neutral-900 pb-2 dark:border-neutral-100">
        <h2
          id="videos-title"
          className="font-display text-xl font-extrabold uppercase tracking-tight sm:text-2xl"
        >
          <span
            className="bg-sn-red mr-2 inline-block h-4 w-1.5 translate-y-[1px] rounded-sm align-middle"
            aria-hidden
          />
          Vidéos &amp; TV
        </h2>
        <div className="flex shrink-0 items-center gap-4">
          <Link
            href="/tv-live"
            className="text-sn-red flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide hover:underline"
          >
            <Radio className="h-3 w-3" aria-hidden />
            TV en direct
          </Link>
          <Link
            href="/videos"
            className="text-sn-green dark:text-sn-green-400 text-xs font-semibold uppercase tracking-wide hover:underline"
          >
            Tout voir →
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Vidéo principale */}
        <article className="group">
          <Link
            href={`/videos/${lead.slug}`}
            className="relative block aspect-video w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800"
          >
            {lead.thumbnail && (
              <Image
                src={lead.thumbnail.url}
                alt={lead.thumbnail.altText ?? lead.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/35">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-lg">
                <Play className="fill-sn-green text-sn-green ml-0.5 h-6 w-6" aria-hidden />
              </span>
            </span>
            {lead.isLive && (
              <span className="bg-sn-red font-ui absolute left-3 top-3 flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" aria-hidden />
                En direct
              </span>
            )}
            <span className="font-ui absolute bottom-3 right-3 rounded-sm bg-black/80 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white">
              {formatClock(lead.durationSeconds)}
            </span>
          </Link>

          <h3 className="font-display mt-3 text-lg font-bold leading-snug sm:text-xl">
            <Link
              href={`/videos/${lead.slug}`}
              className="hover:text-sn-green dark:hover:text-sn-green-400"
            >
              {lead.title}
            </Link>
          </h3>
          {lead.description && (
            <p className="mt-1.5 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
              {lead.description}
            </p>
          )}
          <p className="mt-2 flex items-center gap-3 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3" aria-hidden />
              {formatCompactNumber(lead.viewCount)} vues
            </span>
            {lead.publishedAt && <span>{timeAgo(lead.publishedAt)}</span>}
          </p>
        </article>

        {/* Liste secondaire */}
        <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
          {rest.slice(0, 5).map((video) => (
            <article key={video.id} className="group flex gap-3 py-3 first:pt-0">
              <Link
                href={`/videos/${video.slug}`}
                className="relative h-[72px] w-[128px] shrink-0 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800"
              >
                {video.thumbnail && (
                  <Image
                    src={video.thumbnail.url}
                    alt={video.thumbnail.altText ?? video.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <span className="font-ui absolute bottom-1 right-1 rounded-sm bg-black/80 px-1.5 py-px text-[10px] font-semibold tabular-nums text-white">
                  {formatClock(video.durationSeconds)}
                </span>
              </Link>
              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                  <Link
                    href={`/videos/${video.slug}`}
                    className="hover:text-sn-green dark:hover:text-sn-green-400"
                  >
                    {video.title}
                  </Link>
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-neutral-500">
                  <Eye className="h-3 w-3" aria-hidden />
                  {formatCompactNumber(video.viewCount)} vues
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
