import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Couleur d'accent par rubrique, alignée sur la charte éditoriale. */
const ACCENT_CLASS: Record<string, string> = {
  'sn-green': 'text-sn-green dark:text-sn-green-400',
  'sn-yellow': 'text-sn-yellow-700 dark:text-sn-yellow-500',
  'sn-red': 'text-sn-red dark:text-sn-red-400',
  neutral: 'text-neutral-600 dark:text-neutral-400',
};

interface CategoryBadgeProps {
  slug: string;
  name: string;
  accent?: string | null;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ slug, name, accent, size = 'sm' }: CategoryBadgeProps) {
  return (
    <Link
      href={`/rubrique/${slug}`}
      className={cn(
        'inline-block font-bold uppercase tracking-wider transition-opacity hover:opacity-75',
        ACCENT_CLASS[accent ?? 'sn-green'] ?? ACCENT_CLASS['sn-green'],
        size === 'sm' ? 'text-[11px]' : 'text-xs',
      )}
    >
      {name}
    </Link>
  );
}

/** Titre de section avec filet et lien « tout voir ». */
export function SectionHeading({
  title,
  href,
  accent = 'sn-green',
  description,
}: {
  title: string;
  href?: string;
  accent?: string;
  description?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 border-b-2 border-neutral-900 pb-2 dark:border-neutral-100">
      <div>
        <h2 className="font-display text-xl font-extrabold uppercase tracking-tight sm:text-2xl">
          <span
            className={cn(
              'mr-2 inline-block h-4 w-1.5 translate-y-[1px] rounded-sm align-middle',
              accent === 'sn-red'
                ? 'bg-sn-red'
                : accent === 'sn-yellow'
                  ? 'bg-sn-yellow'
                  : 'bg-sn-green',
            )}
            aria-hidden
          />
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="text-sn-green dark:text-sn-green-400 shrink-0 text-xs font-semibold uppercase tracking-wide hover:underline"
        >
          Tout voir →
        </Link>
      )}
    </div>
  );
}
