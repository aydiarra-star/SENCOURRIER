import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArticleCard } from '@/components/news/article-card';
import { AdSlot } from '@/components/news/ad-slot';
import { JsonLd, breadcrumbSchema, itemListSchema } from '@/components/seo/json-ld';
import { getArticleCards, getCategoriesWithCounts, getAdSlot } from '@/lib/queries';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
interface PageProps {
  params: Promise<{ category: string }>;
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

  if (!category) return { title: 'Rubrique introuvable' };

  return {
    title: category.name,
    description: category.description ?? `Toute l'actualité ${category.name.toLowerCase()} au Sénégal.`,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      type: 'website',
      title: `${category.name} — actualité sénégalaise`,
      description: category.description ?? undefined,
      url: `/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;

  const [category, articles, categories, sidebarAd] = await Promise.all([
    prisma.category.findUnique({
      where: { slug },
      include: {
        children: { where: { isActive: true }, orderBy: { position: 'asc' } },
        parent: { select: { slug: true, name: true } },
      },
    }),
    getArticleCards({ categorySlug: slug, limit: 24 }),
    getCategoriesWithCounts(),
    getAdSlot('SIDEBAR_TOP'),
  ]);

  if (!category) notFound();

  const [lead, ...rest] = articles;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          ...(category.parent ? [{ name: category.parent.name, url: `/${category.parent.slug}` }] : []),
          { name: category.name, url: `/${category.slug}` },
        ])}
      />
      {articles.length > 0 && <JsonLd data={itemListSchema(articles)} />}

      {/* En-tête de rubrique */}
      <div className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
          <nav aria-label="Fil d'Ariane" className="mb-3 flex items-center gap-1.5 text-xs text-neutral-500">
            <Link href="/" className="hover:text-sn-green">
              Accueil
            </Link>
            <span aria-hidden>/</span>
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">{category.name}</span>
          </nav>

          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{category.name}</h1>
          {category.description && (
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {category.description}
            </p>
          )}

          {/* Sous-rubriques */}
          {category.children.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {category.children.map((child) => (
                <li key={child.id}>
                  <Link
                    href={`/${category.slug}/${child.slug}`}
                    className="inline-block rounded-full border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-semibold transition-colors hover:border-sn-green hover:bg-sn-green hover:text-white dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {articles.length === 0 ? (
              <p className="rounded-lg border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500 dark:border-neutral-700">
                Aucun article publié dans cette rubrique pour le moment.
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

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <AdSlot slot={sidebarAd} format="rectangle" />

              <section className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-800">
                <h2 className="border-b border-neutral-200 pb-2 font-ui text-xs font-bold uppercase tracking-wider text-neutral-500 dark:border-neutral-800">
                  Toutes les rubriques
                </h2>
                <ul className="mt-3 space-y-1">
                  {categories.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/${item.slug}`}
                        className={`flex items-center justify-between rounded-md px-2 py-2 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800 ${
                          item.slug === category.slug ? 'font-semibold text-sn-green' : 'text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {item.name}
                        <span className="text-xs text-neutral-400">{item._count.articles}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
