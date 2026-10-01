'use client';

import { Suspense, useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import { SearchResultCard } from '@/components/news/search-result-card';
import { articles } from '@/lib/data';
import type { SearchArticleHit } from '@/lib/types';

/**
 * Aperçu statique : la recherche réelle interroge PostgreSQL via des index
 * trigrammes insensibles aux accents. Ici, le filtrage s'effectue dans le
 * navigateur sur l'instantané de démonstration, avec la même normalisation —
 * « senegal » trouve donc « Sénégal », comme sur le portail complet.
 */
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

type Card = (typeof articles.sections)[number]['articles'][number];

function toHit(article: Card): SearchArticleHit {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt ?? '',
    isPremium: article.isPremium,
    readingMinutes: article.readingMinutes,
    viewCount: article.viewCount,
    publishedAt: article.publishedAt,
    categorySlug: article.category?.slug ?? null,
    categoryName: article.category?.name ?? null,
    categoryShortName: article.category?.shortName ?? null,
    categoryAccent: article.category?.accent ?? null,
    heroImageUrl: article.heroImage?.url ?? null,
    heroImageThumbnail: article.heroImage?.thumbnailUrl ?? null,
    heroImageAlt: article.heroImage?.altText ?? null,
    authorName: article.authors[0]?.user.displayName ?? article.authors[0]?.user.name ?? null,
    authorImage: article.authors[0]?.user.image ?? null,
  };
}

const CORPUS: Card[] = [
  articles.lead,
  ...articles.secondary,
  ...articles.sections.flatMap((section) => section.articles),
  ...articles.related,
]
  .filter((article): article is Card => Boolean(article))
  .filter((article, index, all) => all.findIndex((item) => item.id === article.id) === index);

const SUGGESTIONS = ['Sénégal', 'Politique', 'Économie', 'Lions', 'Diaspora', 'IA'];

function SearchPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [term, setTerm] = useState(query);
  const [input, setInput] = useState(query);

  // Le formulaire navigue côté client : l'URL reste partageable.
  useEffect(() => {
    setTerm(query);
    setInput(query);
  }, [query]);

  const results = useMemo(() => {
    const needle = normalize(term.trim());
    if (needle.length < 2) return [];
    return CORPUS.filter((article) =>
      [article.title, article.excerpt, article.subtitle, article.category?.name]
        .filter(Boolean)
        .some((field) => normalize(String(field)).includes(needle)),
    );
  }, [term]);

  const submit = (value: string) => {
    router.push(value ? `/recherche?q=${encodeURIComponent(value)}` : '/recherche');
  };

  const trimmed = term.trim();

  return (
    <>
      <form
        className="mt-6 flex max-w-2xl gap-2"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          submit(input.trim());
        }}
      >
        <label htmlFor="q" className="sr-only">
          Rechercher un article
        </label>
        <input
          id="q"
          name="q"
          type="search"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Rechercher un article, une rubrique…"
          className="focus:border-sn-green focus:ring-sn-green/30 flex-1 rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900"
        />
        <button
          type="submit"
          className="bg-sn-green hover:bg-sn-green-600 inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white transition-colors"
        >
          <SearchIcon className="h-4 w-4" aria-hidden />
          Chercher
        </button>
      </form>

      {trimmed.length >= 2 && (
        <p className="mt-6 text-sm text-neutral-500" aria-live="polite">
          <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
            {results.length}
          </strong>{' '}
          {results.length > 1 ? 'résultats' : 'résultat'} pour « {trimmed} »
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-4 flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
          {results.map((hit) => (
            <div key={hit.id} className="py-5">
              <SearchResultCard hit={toHit(hit)} />
            </div>
          ))}
        </div>
      )}

      {trimmed.length >= 2 && results.length === 0 && (
        <p className="mt-8 rounded-lg border border-neutral-200 p-6 text-sm text-neutral-500 dark:border-neutral-800">
          Aucun article ne correspond à cette recherche dans l&apos;aperçu.
        </p>
      )}

      {trimmed.length < 2 && (
        <section className="mt-10">
          <h2 className="font-ui text-xs font-bold uppercase tracking-wider text-neutral-500">
            Recherches fréquentes
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => submit(suggestion)}
                className="hover:border-sn-green hover:bg-sn-green rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium transition-colors hover:text-white dark:border-neutral-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Recherche</h1>
      <p className="mt-2 text-sm text-neutral-500">
        La recherche est insensible aux accents et à la casse : « senegal » trouve « Sénégal ».
      </p>
      <Suspense fallback={null}>
        <SearchPanel />
      </Suspense>
    </div>
  );
}
