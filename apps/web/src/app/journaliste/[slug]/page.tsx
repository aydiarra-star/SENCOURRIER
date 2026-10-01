import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Briefcase, Award } from 'lucide-react';
import { ArticleCard } from '@/components/news/article-card';
import { AdSlot } from '@/components/news/ad-slot';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';
import { getAuthorBySlug, getArticleCards, getAdSlot } from '@/lib/queries';
import { initials } from '@/lib/format';

export const dynamic = 'force-dynamic';
interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return { title: 'Journaliste introuvable' };

  return {
    title: author.displayName,
    description: author.bio ?? `Tous les articles de ${author.displayName} sur SENCOURRIER.`,
    alternates: { canonical: `/journaliste/${slug}` },
    openGraph: {
      type: 'profile',
      title: `${author.displayName} — ${author.jobTitle ?? 'Journaliste'}`,
      description: author.bio ?? undefined,
      url: `/journaliste/${slug}`,
      images: author.avatarUrl ? [author.avatarUrl] : undefined,
    },
  };
}
export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) notFound();

  const [articles, sidebarAd] = await Promise.all([
    getArticleCards({ authorId: author.userId, limit: 30 }),
    getAdSlot('SIDEBAR_TOP'),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          { name: 'La rédaction', url: '/a-propos' },
          { name: author.displayName, url: `/journaliste/${author.slug}` },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: author.displayName,
          jobTitle: author.jobTitle ?? 'Journaliste',
          description: author.bio ?? undefined,
          image: author.avatarUrl ?? undefined,
          worksFor: { '@type': 'NewsMediaOrganization', name: 'SENCOURRIER' },
        }}
      />

      <div className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
          <nav
            aria-label="Fil d'Ariane"
            className="mb-5 flex items-center gap-1.5 text-xs text-neutral-500"
          >
            <Link href="/" className="hover:text-sn-green">
              Accueil
            </Link>
            <span aria-hidden>/</span>
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              {author.displayName}
            </span>
          </nav>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <span className="bg-sn-green flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full text-2xl font-bold text-white">
              {author.avatarUrl ? (
                <Image
                  src={author.avatarUrl}
                  alt={author.displayName}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials(author.displayName)
              )}
            </span>

            <div className="flex-1">
              <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                {author.displayName}
              </h1>

              {author.jobTitle && (
                <p className="text-sn-green dark:text-sn-green-400 mt-1.5 flex items-center gap-2 text-sm font-semibold">
                  <Briefcase className="h-4 w-4" aria-hidden />
                  {author.jobTitle}
                </p>
              )}

              {author.bio && (
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {author.bio}
                </p>
              )}

              {author.expertise.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {author.expertise.map((topic) => (
                    <li
                      key={topic}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      <Award className="text-sn-yellow-600 h-3 w-3" aria-hidden />
                      {topic}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-5 flex flex-wrap gap-4 text-sm">
                <span className="text-neutral-500">
                  <strong className="font-semibold text-neutral-900 dark:text-white">
                    {articles.length}
                  </strong>{' '}
                  articles publiés
                </span>
                {author.user.email && (
                  <Link
                    href={`mailto:${author.user.email}`}
                    className="text-sn-green dark:text-sn-green-400 inline-flex items-center gap-1.5 font-semibold hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                    Contacter
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="font-display mb-5 border-b-2 border-neutral-900 pb-2 text-xl font-extrabold uppercase tracking-tight dark:border-neutral-100">
              Ses publications
            </h2>

            {articles.length === 0 ? (
              <p className="rounded-lg border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500 dark:border-neutral-700">
                Aucun article publié pour le moment.
              </p>
            ) : (
              articles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="list" />
              ))
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <AdSlot slot={sidebarAd} format="rectangle" />
              <section className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-800">
                <h2 className="font-ui border-b border-neutral-200 pb-2 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:border-neutral-800">
                  Suivre la rédaction
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Abonnez-vous à notre newsletter pour recevoir les publications de{' '}
                  {author.displayName} et de la rédaction.
                </p>
                <Link
                  href="/newsletter"
                  className="bg-sn-green hover:bg-sn-green-700 mt-4 block rounded-md px-4 py-2.5 text-center text-xs font-semibold text-white"
                >
                  S&apos;abonner à la newsletter
                </Link>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
