import { LatestUpdates } from '@/components/home/latest-updates';
import { ArticleCard } from '@/components/news/article-card';
import { articles } from '@/lib/data';

export const metadata = { title: 'Dernières minutes' };

export default function LatestPage() {
  const feed = [articles.lead, ...articles.secondary].filter(
    (article): article is NonNullable<typeof article> => Boolean(article),
  );

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="border-sn-red mb-8 border-b-2 pb-3">
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
          <span
            className="animate-pulse-live bg-sn-red mr-2 inline-block h-3 w-3 rounded-full align-middle"
            aria-hidden
          />
          Dernières minutes
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Le fil d&apos;actualité mis à jour en continu par la rédaction.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="flex flex-col divide-y divide-neutral-200 lg:col-span-2 dark:divide-neutral-800">
          {feed.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="list"
              className="py-5 first:pt-0"
            />
          ))}
        </div>
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <LatestUpdates updates={articles.latest} />
          </div>
        </aside>
      </div>
    </div>
  );
}
