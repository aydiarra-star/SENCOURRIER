import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArticleCard } from '@/components/news/article-card';
import { JsonLd, breadcrumbSchema, itemListSchema } from '@/components/seo/json-ld';
import { getArticleCards } from '@/lib/queries';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
interface PageProps {
  params: Promise<{ category: string; sub: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, sub } = await params;
  const node = await prisma.category.findFirst({
    where: { slug: sub, parent: { slug: category } },
    select: { name: true, description: true },
  });
  if (!node) return { title: 'Sous-rubrique introuvable' };

  return {
    title: node.name,
    description: node.description ?? `Toute l'actualité ${node.name.toLowerCase()} au Sénégal.`,
    alternates: { canonical: `/${category}/${sub}` },
  };
}

export default async function SubCategoryPage({ params }: PageProps) {
  const { category: parentSlug, sub } = await params;

  const [node, articles] = await Promise.all([
    prisma.category.findFirst({
      where: { slug: sub, parent: { slug: parentSlug } },
      include: {
        parent: { select: { slug: true, name: true } },
        children: { where: { isActive: true }, orderBy: { position: 'asc' } },
      },
    }),
    getArticleCards({ categorySlug: sub, limit: 24 }),
  ]);

  if (!node) notFound();

  const [lead, ...rest] = articles;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          ...(node.parent ? [{ name: node.parent.name, url: `/${node.parent.slug}` }] : []),
          { name: node.name, url: `/${parentSlug}/${node.slug}` },
        ])}
      />
      {articles.length > 0 && <JsonLd data={itemListSchema(articles)} />}

      <div className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
          <nav
            aria-label="Fil d'Ariane"
            className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500"
          >
            <Link href="/" className="hover:text-sn-green">
              Accueil
            </Link>
            {node.parent && (
              <>
                <span aria-hidden>/</span>
                <Link href={`/${node.parent.slug}`} className="hover:text-sn-green">
                  {node.parent.name}
                </Link>
              </>
            )}
            <span aria-hidden>/</span>
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              {node.name}
            </span>
          </nav>

          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {node.name}
          </h1>
          {node.description && (
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {node.description}
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {articles.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500 dark:border-neutral-700">
            Aucun article publié dans cette sous-rubrique pour le moment.
          </p>
        ) : (
          <>
            {lead && <ArticleCard article={lead} variant="hero" priority showExcerpt={false} />}
            <div className="mt-8">
              {rest.map((article) => (
                <ArticleCard key={article.id} article={article} variant="list" />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
