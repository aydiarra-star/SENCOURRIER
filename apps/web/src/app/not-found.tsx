import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="font-display text-7xl font-black text-sn-green">404</p>
      <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
        Cette page n&apos;existe pas ou plus
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        L&apos;article a peut-être été déplacé, ou l&apos;adresse est erronée. Utilisez la recherche
        pour retrouver l&apos;information, ou revenez à la une.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-sn-green px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sn-green-700"
        >
          <Home className="h-4 w-4" aria-hidden />
          Retour à la une
        </Link>
        <Link
          href="/recherche"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-neutral-300 px-6 py-3 text-sm font-semibold transition-colors hover:border-sn-green dark:border-neutral-700"
        >
          <Search className="h-4 w-4" aria-hidden />
          Rechercher un article
        </Link>
      </div>
    </div>
  );
}
