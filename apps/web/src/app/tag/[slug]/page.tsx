import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Hash } from 'lucide-react';
import { ArticleCard } from '@/components/news/article-card';
import { JsonLd, breadcrumbSchema, itemListSchema } from '@/components/seo/json-ld';
import { getArticleCards } from '@/lib/queries';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({ where: { slug }, select: { name: true } });
  if (!tag) return { title: 'Mot-clé introuvable' };
  return {
    title: `#${tag.name}`,
    description: `Tous les articles SENCOURRIER associés au mot-clé ${tag.name}.`,
    alternates: { canonical: `/tag/${slug}` },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;

  const [tag, articles, allTags] = await Promise.all([
    prisma.tag.findUnique({ where: { slug } }),
    getArticleCards({ tagSlug: slug, limit: 30 }),
    prisma.tag.findMany({
      select: { id: true, slug: true, name: true, usageCount: true },
      orderBy: { usageCount: 'desc' },
      take: 30,
    }),
  ]);

  if (!tag) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          { name: `#${tag.name}`, url: `/tag/${tag.slug}` },
        ])}
      />
      {articles.length > 0 && <JsonLd data={itemListSchema(articles)} />}

      <div className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
          <nav
            aria-label="Fil d'Ariane"
            className="mb-3 flex items-center gap-1.5 text-xs text-neutral-500"
          >
            <Link href="/" className="hover:text-sn-green">
              Accueil
            </Link>
            <span aria-hidden>/</span>
            <span>Mots-clés</span>
          </nav>
          <h1 className="font-display flex items-center gap-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            <Hash className="text-sn-green h-7 w-7" aria-hidden />
            {tag.name}
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            {articles.length} article{articles.length > 1 ? 's' : ''} publié
            {articles.length > 1 ? 's' : ''} sur ce sujet.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {articles.length === 0 ? (
              <p className="rounded-lg border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500 dark:border-neutral-700">
                Aucun article publié pour ce mot-clé.
              </p>
            ) : (
              articles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="list" />
              ))
            )}
          </div>

          <aside className="lg:col-span-4">
            <section className="sticky top-24 rounded-lg border border-neutral-200 p-5 dark:border-neutral-800">
              <h2 className="font-ui border-b border-neutral-200 pb-2 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:border-neutral-800">
                Autres sujets
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {allTags.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/tag/${item.slug}`}
                      className={`inline-block rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        item.slug === tag.slug
                          ? 'border-sn-green bg-sn-green text-white'
                          : 'hover:border-sn-green hover:text-sn-green border-neutral-200 dark:border-neutral-700'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
