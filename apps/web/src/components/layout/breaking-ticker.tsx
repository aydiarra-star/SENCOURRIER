'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';

interface BreakingItem {
  id: string;
  slug: string;
  title: string;
  publishedAt: Date | null;
  category: { slug: string; name: string; accent: string } | null;
}

/**
 * Bandeau « dernière minute ». Composant client uniquement pour l'horloge,
 * afin que le HTML rendu côté serveur reste identique à celui du client.
 */
export function BreakingTicker({ items }: { items: BreakingItem[] }) {
  const [time, setTime] = useState<string>('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    tick();
    const clock = setInterval(tick, 30_000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    if (items.length < 2) return;
    const rotate = setInterval(() => setIndex((i) => (i + 1) % items.length), 7_000);
    return () => clearInterval(rotate);
  }, [items.length]);

  if (items.length === 0) return null;
  const current = items[index] ?? items[0];
  if (!current) return null;

  return (
    <div className="relative z-40 bg-sn-red text-white">
      <div className="mx-auto flex max-w-screen-2xl items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <span className="flex shrink-0 items-center gap-1.5 rounded-sm bg-white/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          Dernière minute
        </span>

        <div className="min-w-0 flex-1 overflow-hidden" aria-live="polite" aria-atomic="true">
          <Link
            href={`/article/${current.slug}`}
            key={current.id}
            className="block truncate text-sm font-medium transition-opacity hover:underline"
          >
            <span className="hidden font-semibold uppercase sm:inline">
              {current.category ? `${current.category.name} · ` : ''}
            </span>
            {current.title}
          </Link>
        </div>

        <span className="hidden shrink-0 items-center gap-1 text-xs tabular-nums text-white/85 md:flex">
          <Clock className="h-3 w-3" aria-hidden />
          {time}
        </span>
      </div>
    </div>
  );
}
