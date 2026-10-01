import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { formatCompactNumber } from '@/lib/format';

interface Tag {
  id: string;
  slug: string;
  name: string;
  usageCount: number;
}

/** Nuage des sujets les plus traités par la rédaction. */
export function TrendingTopics({ tags }: { tags: Tag[] }) {
  if (tags.length === 0) return null;

  return (
    <section
      className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-800"
      aria-labelledby="trending-title"
    >
      <h2
        id="trending-title"
        className="flex items-center gap-2 border-b border-neutral-200 pb-3 font-display text-sm font-extrabold uppercase tracking-wider dark:border-neutral-800"
      >
        <TrendingUp className="h-4 w-4 text-sn-yellow-600" aria-hidden />
        Tendances
      </h2>

      <ul className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag.id}>
            <Link
              href={`/tag/${tag.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium transition-colors hover:border-sn-green hover:bg-sn-green hover:text-white dark:border-neutral-700"
            >
              <span className="text-neutral-400">#</span>
              {tag.name}
              <span className="text-[10px] text-neutral-400">{formatCompactNumber(tag.usageCount)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
