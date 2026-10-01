import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/news/article-card';
import { AdSlot } from '@/components/news/ad-slot';
import { articles, media } from '@/lib/data';

/**
 * Aperçu statique : les rubriques disponibles sont figées à la construction.
 * Sur le portail complet, `/rubrique/[slug]` couvre toute l'arborescence.
 */
export function generateStaticParams() {
  return articles.sections
    .filter((section) => section.articles.length > 0)
    .map((section) => ({ slug: section.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const section = articles.sections.find((item) => item.slug === slug);
  if (!section) notFound();

  const [lead, ...rest] = section.articles;

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
      <nav
        aria-label="Fil d'Ariane"
        className="mb-4 flex items-center gap-1.5 text-xs text-neutral-500"
      >
        <Link href="/" className="hover:text-sn-green">
          Accueil
        </Link>
        <span aria-hidden>/</span>
        <span className="font-semibold text-neutral-700 dark:text-neutral-300">{section.name}</span>
      </nav>

      <header className="mb-8 border-b-2 border-neutral-900 pb-3 dark:border-neutral-100">
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
          <span
            className="bg-sn-green mr-3 inline-block h-5 w-1.5 translate-y-[2px] rounded-sm align-middle"
            aria-hidden
          />
          {section.name}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          {section.articles.length} articles publiés dans cette rubrique.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {lead && <ArticleCard article={lead} variant="hero" priority />}
        </div>
        <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
          {rest.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="compact"
              className="py-4 first:pt-0"
            />
          ))}
        </div>
      </div>

      <div className="mt-10">
        <AdSlot slot={media.ad} format="leaderboard" />
      </div>

      <section className="mt-12" aria-labelledby="others-title">
        <h2
          id="others-title"
          className="font-display mb-5 border-b-2 border-neutral-900 pb-2 text-lg font-extrabold uppercase tracking-tight dark:border-neutral-100"
        >
          Autres rubriques
        </h2>
        <div className="flex flex-wrap gap-2">
          {articles.sections
            .filter((item) => item.slug !== slug && item.articles.length > 0)
            .map((item) => (
              <Link
                key={item.slug}
                href={`/rubrique/${item.slug}`}
                className="hover:border-sn-green hover:bg-sn-green rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium transition-colors hover:text-white dark:border-neutral-700"
              >
                {item.name}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
