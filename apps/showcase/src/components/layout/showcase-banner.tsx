'use client';

import { useState } from 'react';
import { Info, X, ExternalLink } from 'lucide-react';

const LIVE_URL =
  process.env.NEXT_PUBLIC_LIVE_URL ?? 'https://work-1-ygvrymnypwbgvwvd.prod-runtime.all-hands.dev/';

/**
 * Bandeau d'information : cette page est un aperçu statique de l'interface.
 * La plateforme complète (recherche, comptes, abonnements, API) tourne sur
 * l'environnement d'exécution, accessible par le lien ci-dessous.
 */
export function ShowcaseBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-brand-slate-900 relative z-40 text-white">
      <div className="mx-auto flex max-w-screen-2xl items-center gap-3 px-4 py-2 text-xs sm:px-6 lg:px-8">
        <Info className="text-brand-yellow h-4 w-4 shrink-0" aria-hidden />
        <p className="flex-1 leading-snug">
          <span className="font-semibold">Aperçu de l&apos;interface</span> — page statique publiée
          sur GitHub Pages. La plateforme complète (recherche, comptes, abonnements, API) est en
          ligne.
        </p>
        <a
          href={LIVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xs bg-brand-green hover:bg-brand-green-600 hidden shrink-0 items-center gap-1 px-2.5 py-1 font-semibold transition-colors sm:inline-flex"
        >
          Voir le site complet
          <ExternalLink className="h-3 w-3" aria-hidden />
        </a>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Masquer le bandeau"
          className="rounded-xs shrink-0 p-1 transition-colors hover:bg-white/10"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
