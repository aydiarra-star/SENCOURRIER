import Link from 'next/link';
import Image from 'next/image';
import { Clock, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { editorialTimestamp } from '@/lib/format';
import { CategoryBadge } from '@/components/news/category-badge';

export interface ArticleCardData {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  isPremium: boolean;
  isBreaking: boolean;
  readingMinutes: number;
  viewCount: number;
  publishedAt: Date | null;
  category: { slug: string; name: string; shortName: string | null; accent: string } | null;
  heroImage: { url: string; thumbnailUrl: string | null; altText: string | null } | null;
  authors: { user: { id: string; displayName: string | null; name: string | null } }[];
}

type Variant = 'hero' | 'featured' | 'standard' | 'compact' | 'list';

interface ArticleCardProps {
  article: ArticleCardData;
  variant?: Variant;
  priority?: boolean;
  showExcerpt?: boolean;
  className?: string;
}

const authorName = (article: ArticleCardData) =>
  article.authors[0]?.user.displayName ?? article.authors[0]?.user.name ?? 'La rédaction';

export function ArticleCard({
  article,
  variant = 'standard',
  priority = false,
  showExcerpt = true,
  className,
}: ArticleCardProps) {
  const href = `/article/${article.slug}`;
  const image = article.heroImage;

  if (variant === 'compact') {
    return (
      <article className={cn('group flex gap-3', className)}>
        <Link
          href={href}
          className="relative h-[68px] w-[92px] shrink-0 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800"
        >
          {image && (
            <Image
              src={image.thumbnailUrl ?? image.url}
              alt={image.altText ?? article.title}
              fill
              sizes="92px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-snug">
            <Link
              href={href}
              className="hover:text-sn-green dark:hover:text-sn-green-400 transition-colors"
            >
              {article.title}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
            <time dateTime={article.publishedAt?.toISOString()}>
              {article.publishedAt ? editorialTimestamp(article.publishedAt) : ''}
            </time>
            {article.isPremium && (
              <Lock
                className="text-sn-yellow-600 h-3 w-3"
                aria-label="Article réservé aux abonnés"
              />
            )}
          </p>
        </div>
      </article>
    );
  }

  if (variant === 'list') {
    return (
      <article
        className={cn(
          'group border-b border-neutral-200 py-5 last:border-0 dark:border-neutral-800',
          className,
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="min-w-0 flex-1">
            {article.category && (
              <CategoryBadge
                slug={article.category.slug}
                name={article.category.name}
                accent={article.category.accent}
              />
            )}
            <h3 className="font-display mt-2 text-lg font-bold leading-snug sm:text-xl">
              <Link
                href={href}
                className="hover:text-sn-green dark:hover:text-sn-green-400 transition-colors"
              >
                {article.title}
              </Link>
            </h3>
            {showExcerpt && article.excerpt && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {article.excerpt}
              </p>
            )}
            <Meta article={article} />
          </div>
          {image && (
            <Link
              href={href}
              className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:aspect-[4/3] sm:w-52 dark:bg-neutral-800"
            >
              <Image
                src={image.thumbnailUrl ?? image.url}
                alt={image.altText ?? article.title}
                fill
                sizes="(max-width: 640px) 100vw, 208px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          )}
        </div>
      </article>
    );
  }

  const isHero = variant === 'hero';
  const isFeatured = variant === 'featured';

  return (
    <article className={cn('group flex flex-col', className)}>
      {image && (
        <Link
          href={href}
          className={cn(
            'relative w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800',
            isHero ? 'aspect-[16/9] rounded-xl' : 'aspect-[16/10] rounded-lg',
          )}
        >
          <Image
            src={image.url}
            alt={image.altText ?? article.title}
            fill
            priority={priority}
            sizes={isHero ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          {article.isPremium && (
            <span className="bg-sn-yellow absolute left-3 top-3 flex items-center gap-1 rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-900">
              <Lock className="h-3 w-3" aria-hidden />
              Abonnés
            </span>
          )}
        </Link>
      )}

      <div className={cn(isHero ? 'mt-4' : 'mt-3')}>
        {article.category && (
          <CategoryBadge
            slug={article.category.slug}
            name={article.category.name}
            accent={article.category.accent}
          />
        )}

        <h3
          className={cn(
            'font-display mt-2 font-bold leading-tight tracking-tight',
            isHero
              ? 'text-2xl sm:text-3xl lg:text-4xl'
              : isFeatured
                ? 'text-xl sm:text-2xl'
                : 'text-base sm:text-lg',
          )}
        >
          <Link
            href={href}
            className="hover:text-sn-green dark:hover:text-sn-green-400 transition-colors"
          >
            {article.title}
          </Link>
        </h3>

        {isHero && article.subtitle && (
          <p className="mt-2.5 text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-300">
            {article.subtitle}
          </p>
        )}

        {showExcerpt && article.excerpt && !isHero && (
          <p
            className={cn(
              'mt-2 leading-relaxed text-neutral-600 dark:text-neutral-400',
              isFeatured ? 'line-clamp-3 text-sm' : 'line-clamp-2 text-sm',
            )}
          >
            {article.excerpt}
          </p>
        )}

        <Meta article={article} />
      </div>
    </article>
  );
}

function Meta({ article }: { article: ArticleCardData }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
      <span className="font-medium text-neutral-700 dark:text-neutral-300">
        {authorName(article)}
      </span>
      <span aria-hidden>·</span>
      <time dateTime={article.publishedAt?.toISOString()}>
        {article.publishedAt ? editorialTimestamp(article.publishedAt) : ''}
      </time>
      <span aria-hidden>·</span>
      <span className="inline-flex items-center gap-1">
        <Clock className="h-3 w-3" aria-hidden />
        {article.readingMinutes} min de lecture
      </span>
    </div>
  );
}
