import Image from 'next/image';
import Link from 'next/link';
import { Clock, Lock } from 'lucide-react';
import { CategoryBadge } from '@/components/news/category-badge';
import { editorialTimestamp } from '@/lib/format';
import type { SearchArticleHit } from '@/lib/types';

/**
 * Résultat de recherche.
 *
 * Le résultat provient d'une requête SQL dédiée (jointures plates) et non du
 * select relationnel des cartes d'article : la carte est donc autonome plutôt
 * que réutilisée, pour éviter de remodeler chaque ligne en objet imbriqué.
 */
export function SearchResultCard({ hit }: { hit: SearchArticleHit }) {
  const image = hit.heroImageThumbnail ?? hit.heroImageUrl;

  return (
    <article className="flex gap-4 border-b border-neutral-200 py-5 first:pt-0 last:border-b-0 dark:border-neutral-800">
      <Link
        href="/article"
        className="relative hidden h-24 w-40 shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:block dark:bg-neutral-800"
      >
        {image && (
          <Image
            src={image}
            alt={hit.heroImageAlt ?? hit.title}
            fill
            sizes="160px"
            className="object-cover"
          />
        )}
      </Link>

      <div className="min-w-0 flex-1">
        {hit.categoryName && hit.categorySlug && (
          <CategoryBadge
            slug={hit.categorySlug}
            name={hit.categoryName}
            accent={hit.categoryAccent}
          />
        )}

        <h2 className="mt-1 text-lg font-bold leading-snug">
          <Link
            href="/article"
            className="hover:text-sn-green dark:hover:text-sn-green-400 transition-colors"
          >
            {hit.title}
          </Link>
          {hit.isPremium && (
            <span className="bg-sn-yellow/20 text-sn-yellow-700 dark:text-sn-yellow-500 ml-2 inline-flex translate-y-[-1px] items-center gap-1 rounded px-1.5 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wide">
              <Lock className="h-3 w-3" aria-hidden />
              Premium
            </span>
          )}
        </h2>

        <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
          {hit.excerpt}
        </p>

        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
          {hit.publishedAt && (
            <time dateTime={new Date(hit.publishedAt).toISOString()}>
              {editorialTimestamp(hit.publishedAt)}
            </time>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {hit.readingMinutes} min de lecture
          </span>
          {hit.authorName && <span>{hit.authorName}</span>}
        </p>
      </div>
    </article>
  );
}
