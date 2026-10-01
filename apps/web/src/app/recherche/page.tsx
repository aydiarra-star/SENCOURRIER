import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, SlidersHorizontal } from 'lucide-react';
import { SearchResultCard } from '@/components/news/search-result-card';
import { searchArticles, getSearchCategories } from '@/lib/queries';

export const dynamic = 'force-dynamic';
interface PageProps {
  searchParams: Promise<{ q?: string; rubrique?: string; tri?: string }>;
}

export const metadata: Metadata = {
  title: 'Recherche',
  description: 'Recherchez une information, un sujet ou un auteur dans les archives de SENCOURRIER.',
  robots: { index: false, follow: true },
};

/**
 * Recherche plein texte.
 *
 * La recherche est insensible à la casse ET aux accents : « Senegal » et
 * « Sénégal » renvoient les mêmes résultats, grâce à l'index d'expression
 * PostgreSQL `unaccent + pg_trgm` (voir `lib/queries.ts`). En production,
 * Elasticsearch prend le relais pour la tolérance aux fautes et les facettes.
 */
export default async function SearchPage({ searchParams }: PageProps) {
  const { q = '', rubrique = '', tri = 'pertinence' } = await searchParams;
  const query = q.trim();
  const sort = tri === 'recent' ? 'recent' : 'pertinence';

  const categories = await getSearchCategories();

  if (query.length < 2) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Rechercher</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Saisissez au moins deux caractères pour lancer une recherche dans l&apos;ensemble des
          publications de la rédaction.
        </p>

        <form action="/recherche" method="get" className="mt-6 flex gap-2">
          <input
            name="q"
            type="search"
            defaultValue={query}
            autoFocus
            placeholder="Ex. : gaz, Saint-Louis, Lions de la Teranga…"
            className="flex-1 rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-sn-green focus:ring-2 focus:ring-sn-green/20 dark:border-neutral-700 dark:bg-neutral-950"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-sn-green px-6 py-3 text-sm font-semibold text-white hover:bg-sn-green-700"
          >
            <Search className="h-4 w-4" aria-hidden />
            Rechercher
          </button>
        </form>
      </div>
    );
  }

  const { items, total } = await searchArticles({ query, categorySlug: rubrique || undefined, sort });

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        Recherche
      </h1>

      <form action="/recherche" method="get" className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Rechercher…"
          className="flex-1 rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-sn-green focus:ring-2 focus:ring-sn-green/20 dark:border-neutral-700 dark:bg-neutral-950"
        />
        <select
          name="rubrique"
          defaultValue={rubrique}
          aria-label="Filtrer par rubrique"
          className="rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
        >
          <option value="">Toutes les rubriques</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          name="tri"
          defaultValue={sort}
          aria-label="Trier les résultats"
          className="rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
        >
          <option value="pertinence">Pertinence</option>
          <option value="recent">Les plus récents</option>
        </select>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-sn-green px-6 py-3 text-sm font-semibold text-white hover:bg-sn-green-700"
        >
          <Search className="h-4 w-4" aria-hidden />
          Rechercher
        </button>
      </form>

      <p className="mt-6 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
        <SlidersHorizontal className="h-4 w-4" aria-hidden />
        <span>
          <strong className="font-semibold text-neutral-900 dark:text-white">{total}</strong> résultat
          {total > 1 ? 's' : ''} pour « <span className="font-medium">{query}</span> »
        </span>
      </p>

      {items.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-700">
          <p className="font-semibold">Aucun article ne correspond à votre recherche.</p>
          <p className="mt-2 text-sm text-neutral-500">
            Essayez des termes plus généraux, ou parcourez nos{' '}
            <Link href="/" className="font-semibold text-sn-green hover:underline">
              rubriques
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="mx-auto mt-4 max-w-4xl">
          {items.map((hit) => (
            <SearchResultCard key={hit.id} hit={hit} />
          ))}
        </div>
      )}
    </div>
  );
}
