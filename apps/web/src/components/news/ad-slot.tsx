import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AdSlotProps {
  slot: {
    id: string;
    name: string;
    imageUrl: string | null;
    targetUrl: string | null;
    htmlSnippet: string | null;
  } | null;
  /** Rapport d'aspect réservé : évite tout décalage de mise en page. */
  format?: 'leaderboard' | 'rectangle' | 'in-article' | 'footer';
  className?: string;
}

const FORMAT_CLASS: Record<NonNullable<AdSlotProps['format']>, string> = {
  leaderboard: 'aspect-[728/90] max-w-[728px]',
  rectangle: 'aspect-[300/250] max-w-[300px]',
  'in-article': 'aspect-[728/90] max-w-[728px]',
  footer: 'aspect-[970/90] max-w-[970px]',
};

/**
 * Emplacement publicitaire.
 *
 * Le conteneur est rendu même sans annonce : il réserve la place et évite
 * ainsi les décalages de mise en page (CLS), critère des Core Web Vitals.
 */
export function AdSlot({ slot, format = 'leaderboard', className }: AdSlotProps) {
  const label = (
    <span className="absolute right-0 top-0 font-ui text-[9px] uppercase tracking-wider text-neutral-400 dark:text-neutral-600">
      Publicité
    </span>
  );

  if (!slot) {
    return (
      <div className={cn('relative mx-auto w-full', FORMAT_CLASS[format], className)} aria-hidden>
        {label}
      </div>
    );
  }

  return (
    <aside
      className={cn('relative mx-auto w-full', FORMAT_CLASS[format], className)}
      aria-label="Emplacement publicitaire"
    >
      {label}
      {slot.htmlSnippet ? (
        <div dangerouslySetInnerHTML={{ __html: slot.htmlSnippet }} />
      ) : slot.imageUrl && slot.targetUrl ? (
        <Link
          href={slot.targetUrl}
          rel="nofollow sponsored noopener"
          target="_blank"
          className="relative block h-full w-full overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <Image src={slot.imageUrl} alt={slot.name} fill sizes="728px" className="object-contain" />
        </Link>
      ) : null}
    </aside>
  );
}
