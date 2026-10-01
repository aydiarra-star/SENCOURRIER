import type { Metadata } from 'next';
import { ArticleCard } from '@/components/news/article-card';
import { JsonLd, breadcrumbSchema, itemListSchema } from '@/components/seo/json-ld';
import { getArticleCards } from '@/lib/queries';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Dernières minutes',
  description:
    "Le fil d'actualité en continu de SENCOURRIER : toutes les informations publiées dans les dernières 24 heures.",
  alternates: { canonical: '/dernieres-minutes' },
};

export default async function LatestPage() {
  const articles = await getArticleCards({ limit: 40 });

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          { name: 'Dernières minutes', url: '/dernieres-minutes' },
        ])}
      />
      {articles.length > 0 && <JsonLd data={itemListSchema(articles)} />}

      <div className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-display flex items-center gap-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            <span className="relative flex h-3 w-3">
              <span className="bg-sn-red absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
              <span className="bg-sn-red relative inline-flex h-3 w-3 rounded-full" />
            </span>
            Dernières minutes
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Toutes les publications de la rédaction, de la plus récente à la plus ancienne.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="list" />
        ))}
      </div>
    </>
  );
}
