import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, Calendar, MessageSquare, Lock, Share2 } from 'lucide-react';
import { ArticleCard } from '@/components/news/article-card';
import { AdSlot } from '@/components/news/ad-slot';
import { JsonLd, newsArticleSchema, breadcrumbSchema } from '@/components/seo/json-ld';
import { getArticleBySlug, getRelatedArticles, getAdSlot } from '@/lib/queries';
import { formatDateTime, formatCompactNumber, initials } from '@/lib/format';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
interface PageProps {
  params: Promise<{ slug: string }>;
}

// Un article publié est révalidé toutes les 5 minutes (ISR).

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return { title: 'Article introuvable' };

  const image = article.heroImage?.url ?? '/logo.svg';
  const authorNames = article.authors
    .map((a) => a.user.displayName ?? a.user.name)
    .filter(Boolean)
    .join(', ');

  return {
    title: article.title,
    description: article.excerpt ?? article.subtitle ?? undefined,
    authors: authorNames ? [{ name: authorNames }] : undefined,
    alternates: { canonical: `/article/${article.slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt ?? undefined,
      url: `/article/${article.slug}`,
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: authorNames ? [authorNames] : undefined,
      section: article.category?.name,
      tags: article.tags.map((t) => t.tag.name),
      images: [{ url: image, width: 1600, height: 900, alt: article.heroImage?.altText ?? article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt ?? undefined,
      images: [image],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  // L'incrément de vues est « best effort » : une erreur de comptage ne doit
  // jamais empêcher l'affichage de l'article.
  prisma.article
    .update({ where: { id: article.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => undefined);

  const [related, inArticleAd, sidebarAd] = await Promise.all([
    article.categoryId ? getRelatedArticles(article.categoryId, article.id, 3) : Promise.resolve([]),
    getAdSlot('IN_ARTICLE'),
    getAdSlot('SIDEBAR_MIDDLE'),
  ]);

  const primaryAuthor = article.authors[0];
  const authorProfile = primaryAuthor?.user.authorProfile;
  const authorName = primaryAuthor?.user.displayName ?? primaryAuthor?.user.name ?? 'La rédaction';
  const authorSlug = authorProfile?.slug;
  const tags = article.tags.map((t) => t.tag);

  return (
    <>
      <JsonLd
        data={newsArticleSchema({
          slug: article.slug,
          title: article.title,
          subtitle: article.subtitle,
          excerpt: article.excerpt,
          publishedAt: article.publishedAt,
          updatedAt: article.updatedAt,
          isPremium: article.isPremium,
          readingMinutes: article.readingMinutes,
          wordCount: article.wordCount,
          heroImage: article.heroImage
            ? {
                url: article.heroImage.url,
                width: article.heroImage.width,
                height: article.heroImage.height,
                altText: article.heroImage.altText,
              }
            : null,
          category: article.category ? { slug: article.category.slug, name: article.category.name } : null,
          tags: tags.map((t) => t.name),
          authors: article.authors.map((a) => ({
            name: a.user.displayName ?? a.user.name ?? 'La rédaction',
            url: a.user.authorProfile?.slug ? `/journaliste/${a.user.authorProfile.slug}` : null,
            jobTitle: a.user.authorProfile?.jobTitle ?? null,
          })),
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          ...(article.category ? [{ name: article.category.name, url: `/${article.category.slug}` }] : []),
          { name: article.title, url: `/article/${article.slug}` },
        ])}
      />

      <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
        <nav aria-label="Fil d'Ariane" className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
          <Link href="/" className="hover:text-sn-green">
            Accueil
          </Link>
          {article.category && (
            <>
              <span aria-hidden>/</span>
              <Link href={`/${article.category.slug}`} className="font-semibold hover:text-sn-green">
                {article.category.name}
              </Link>
            </>
          )}
        </nav>

        <div className="grid gap-10 lg:grid-cols-12">
          <article className="lg:col-span-8">
            <header>
              {article.category && (
                <Link
                  href={`/${article.category.slug}`}
                  className="font-ui text-xs font-bold uppercase tracking-wider text-sn-green hover:underline dark:text-sn-green-400"
                >
                  {article.category.name}
                </Link>
              )}

              <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>

              {article.subtitle && (
                <p className="mt-4 text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-300">
                  {article.subtitle}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-neutral-200 py-4 dark:border-neutral-800">
                {authorSlug ? (
                  <Link href={`/journaliste/${authorSlug}`} className="group flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sn-green text-sm font-bold text-white">
                      {authorProfile?.avatarUrl ? (
                        <Image
                          src={authorProfile.avatarUrl}
                          alt={authorName}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials(authorName)
                      )}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold group-hover:text-sn-green">{authorName}</span>
                      {authorProfile?.jobTitle && (
                        <span className="block text-xs text-neutral-500">{authorProfile.jobTitle}</span>
                      )}
                    </span>
                  </Link>
                ) : (
                  <span className="text-sm font-semibold">{authorName}</span>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" aria-hidden />
                    <time dateTime={article.publishedAt?.toISOString()}>
                      {article.publishedAt ? formatDateTime(article.publishedAt) : ''}
                    </time>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {article.readingMinutes} min de lecture
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" aria-hidden />
                    {formatCompactNumber(article.viewCount)} lectures
                  </span>
                  {article.commentCount > 0 && (
                    <span className="inline-flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                      {article.commentCount} commentaires
                    </span>
                  )}
                </div>

                <span className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-semibold dark:border-neutral-700">
                  <Share2 className="h-3.5 w-3.5" aria-hidden />
                  Partager
                </span>
              </div>
            </header>

            {article.heroImage && (
              <figure className="mt-6">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                  <Image
                    src={article.heroImage.url}
                    alt={article.heroImage.altText ?? article.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                  />
                </div>
                {(article.heroImage.caption || article.heroImage.credit) && (
                  <figcaption className="mt-2 text-xs text-neutral-500">
                    {article.heroImage.caption}
                    {article.heroImage.credit && (
                      <span className="ml-1 text-neutral-400">— Crédit : {article.heroImage.credit}</span>
                    )}
                  </figcaption>
                )}
              </figure>
            )}

            {article.isPremium ? (
              <PremiumPaywall excerpt={article.excerpt} />
            ) : (
              <div className="article-prose mt-7" dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />
            )}

            {tags.length > 0 && (
              <div className="mt-10 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                <h2 className="font-ui text-xs font-bold uppercase tracking-wider text-neutral-500">Mots-clés</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <li key={tag.id}>
                      <Link
                        href={`/tag/${tag.slug}`}
                        className="inline-block rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium transition-colors hover:border-sn-green hover:bg-sn-green hover:text-white dark:border-neutral-700"
                      >
                        #{tag.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8">
              <AdSlot slot={inArticleAd} format="in-article" />
            </div>

            {related.length > 0 && (
              <section className="mt-12" aria-labelledby="related-title">
                <h2
                  id="related-title"
                  className="mb-5 border-b-2 border-neutral-900 pb-2 font-display text-lg font-extrabold uppercase tracking-tight dark:border-neutral-100"
                >
                  À lire également
                </h2>
                <div className="grid gap-6 sm:grid-cols-3">
                  {related.map((item) => (
                    <ArticleCard key={item.id} article={item} variant="standard" showExcerpt={false} />
                  ))}
                </div>
              </section>
            )}
          </article>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <AdSlot slot={sidebarAd} format="rectangle" />

              {authorProfile && (
                <section className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-800">
                  <h2 className="font-ui text-xs font-bold uppercase tracking-wider text-neutral-500">
                    À propos de l&apos;auteur
                  </h2>
                  <div className="mt-3 flex items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sn-green text-base font-bold text-white">
                      {authorProfile.avatarUrl ? (
                        <Image
                          src={authorProfile.avatarUrl}
                          alt={authorName}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials(authorName)
                      )}
                    </span>
                    <div>
                      <p className="font-semibold">{authorName}</p>
                      {authorProfile.jobTitle && <p className="text-xs text-neutral-500">{authorProfile.jobTitle}</p>}
                    </div>
                  </div>
                  {authorProfile.bio && (
                    <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {authorProfile.bio}
                    </p>
                  )}
                  {authorSlug && (
                    <Link
                      href={`/journaliste/${authorSlug}`}
                      className="mt-3 inline-block text-xs font-semibold text-sn-green hover:underline dark:text-sn-green-400"
                    >
                      Tous ses articles →
                    </Link>
                  )}
                </section>
              )}

              {related.length > 0 && (
                <section className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-800">
                  <h2 className="border-b border-neutral-200 pb-2 font-ui text-xs font-bold uppercase tracking-wider text-neutral-500 dark:border-neutral-800">
                    Dans la même rubrique
                  </h2>
                  <div className="mt-3 flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800">
                    {related.map((item) => (
                      <ArticleCard key={item.id} article={item} variant="compact" className="py-3 first:pt-0" />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

/**
 * Mur payant Premium.
 * L'accès réel est contrôlé côté serveur (API NestJS) : ce composant présente
 * l'offre, il ne protège pas le contenu à lui seul.
 */
function PremiumPaywall({ excerpt }: { excerpt: string | null }) {
  return (
    <div className="mt-7">
      {excerpt && (
        <p className="text-lg font-medium leading-relaxed text-neutral-700 dark:text-neutral-300">{excerpt}</p>
      )}

      <div className="relative mt-5 max-h-32 overflow-hidden" aria-hidden>
        <div className="space-y-3 select-none blur-[3px]">
          <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
            La suite de cet article est réservée aux abonnés. Nos enquêtes et analyses longues demandent
            des semaines de travail : c&apos;est votre abonnement qui les finance.
          </p>
          <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
            Les lecteurs abonnés accèdent à l&apos;intégralité du texte, aux dossiers spéciaux et à
            l&apos;ensemble des archives de la rédaction.
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent dark:from-neutral-950" />
      </div>

      <div className="mt-6 rounded-xl border border-sn-yellow bg-sn-yellow-50 p-6 dark:bg-neutral-900">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-sn-yellow-700" aria-hidden />
          <p className="font-ui text-xs font-bold uppercase tracking-wider text-sn-yellow-700 dark:text-sn-yellow-500">
            Article réservé aux abonnés
          </p>
        </div>
        <h2 className="mt-2 font-display text-xl font-extrabold">
          Soutenez un journalisme exigeant, indépendant et sénégalais
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          Pour 2 500 FCFA par mois, accédez à toutes les enquêtes, aux analyses de fond, aux podcasts
          premium et à une lecture sans publicité.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/abonnement"
            className="rounded-md bg-sn-green px-6 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-sn-green-700"
          >
            Découvrir les offres
          </Link>
          <Link
            href="/connexion"
            className="rounded-md border border-neutral-300 px-6 py-2.5 text-center text-sm font-semibold transition-colors hover:border-sn-green dark:border-neutral-700"
          >
            J&apos;ai déjà un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
