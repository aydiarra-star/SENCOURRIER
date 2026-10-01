import Link from 'next/link';
import { editorialTimestamp } from '@/lib/format';

interface Update {
  id: string;
  slug: string;
  title: string;
  publishedAt: Date | null;
  category: { slug: string; name: string; accent: string } | null;
}

/**
 * Fil « Dernières minutes ».
 * La mise à jour est assurée par la revalidation ISR de la page hôte.
 */
export function LatestUpdates({ updates }: { updates: Update[] }) {
  if (updates.length === 0) return null;

  return (
    <section
      className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900"
      aria-labelledby="latest-title"
    >
      <h2
        id="latest-title"
        className="font-display flex items-center gap-2 border-b border-neutral-200 pb-3 text-sm font-extrabold uppercase tracking-wider dark:border-neutral-800"
      >
        <span className="relative flex h-2 w-2">
          <span className="bg-sn-red absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
          <span className="bg-sn-red relative inline-flex h-2 w-2 rounded-full" />
        </span>
        Dernières minutes
      </h2>

      <ol className="mt-1 divide-y divide-neutral-200 dark:divide-neutral-800">
        {updates.map((update) => (
          <li key={update.id} className="py-3 first:pt-3">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide">
              <time
                dateTime={update.publishedAt?.toISOString()}
                className="text-sn-green dark:text-sn-green-400 tabular-nums"
              >
                {update.publishedAt
                  ? new Date(update.publishedAt).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '--:--'}
              </time>
              {update.category && <span className="text-neutral-400">{update.category.name}</span>}
            </p>
            <h3 className="mt-1 text-sm font-medium leading-snug">
              <Link href="/article" className="hover:text-sn-green dark:hover:text-sn-green-400">
                {update.title}
              </Link>
            </h3>
            <p className="mt-0.5 text-[11px] text-neutral-400">
              {editorialTimestamp(update.publishedAt ?? new Date())}
            </p>
          </li>
        ))}
      </ol>

      <Link
        href="/dernieres-minutes"
        className="text-sn-green dark:text-sn-green-400 mt-3 block text-center text-xs font-semibold uppercase tracking-wide hover:underline"
      >
        Tout le fil d&apos;actualité →
      </Link>
    </section>
  );
}
