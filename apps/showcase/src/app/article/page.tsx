import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Eye, MessageSquare, Share2 } from 'lucide-react';
import { ArticleCard } from '@/components/news/article-card';
import { AdSlot } from '@/components/news/ad-slot';
import { JsonLd, newsArticleSchema, breadcrumbSchema } from '@/components/seo/json-ld';
import { articles, media } from '@/lib/data';
import { editorialTimestamp, formatCompactNumber, initials } from '@/lib/format';

export default function ArticlePage() {
  const article = articles.full;
  if (!article) return null;

  const author = article.authors[0]?.user;
  const authorName = author?.displayName ?? author?.name ?? 'La rédaction';

  return (
    <>
      <JsonLd
        data={newsArticleSchema({
          slug: article.slug,
          title: article.title,
          subtitle: article.subtitle,
          excerpt: article.excerpt,
          publishedAt: article.publishedAt,
          updatedAt: article.publishedAt ?? new Date(),
          isPremium: article.isPremium,
          readingMinutes: article.readingMinutes,
          wordCount: article.readingMinutes * 220,
          heroImage: article.heroImage,
          category: article.category,
          tags: article.tags.map(({ tag }) => tag.name),
          authors: [{ name: authorName, url: null, jobTitle: 'Journaliste' }],
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          {
            name: article.category?.name ?? 'Actualité',
            url: `/rubrique/${article.category?.slug ?? ''}`,
          },
          { name: article.title, url: `/article/${article.slug}` },
        ])}
      />

      <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
        <nav
          aria-label="Fil d'Ariane"
          className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500"
        >
          <Link href="/" className="hover:text-sn-green">
            Accueil
          </Link>
          <span aria-hidden>/</span>
          <Link
            href={`/rubrique/${article.category?.slug}`}
            className="hover:text-sn-green font-semibold"
          >
            {article.category?.name}
          </Link>
          <span aria-hidden>/</span>
          <span className="truncate text-neutral-400">{article.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12">
          <article className="lg:col-span-8">
            <header>
              <Link
                href={`/rubrique/${article.category?.slug}`}
                className="font-ui text-sn-green dark:text-sn-green-400 text-xs font-bold uppercase tracking-wider hover:underline"
              >
                {article.category?.name}
              </Link>
              <h1 className="font-display mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>
              {article.subtitle && (
                <p className="mt-4 text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-300">
                  {article.subtitle}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-neutral-200 py-4 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <span className="bg-sn-green flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-bold text-white">
                    {initials(authorName)}
                  </span>
                  <span className="text-sm font-semibold">{authorName}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" aria-hidden />
                    <time dateTime={article.publishedAt?.toISOString()}>
                      {article.publishedAt ? editorialTimestamp(article.publishedAt) : ''}
                    </time>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {article.readingMinutes} min de lecture
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" aria-hidden />
                    {formatCompactNumber(article.viewCount)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                    {article.commentCount}
                  </span>
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
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    className="object-cover"
                  />
                </div>
                {article.heroImage.altText && (
                  <figcaption className="mt-2 text-xs text-neutral-500">
                    {article.heroImage.altText}
                  </figcaption>
                )}
              </figure>
            )}

            <div
              className="article-prose mt-7"
              dangerouslySetInnerHTML={{ __html: article.bodyHtml ?? '' }}
            />

            {article.tags.length > 0 && (
              <div className="mt-10 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                <h2 className="font-ui text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Mots-clés
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {article.tags.map(({ tag }) => (
                    <li key={tag.id}>
                      <Link
                        href="/recherche"
                        className="hover:border-sn-green hover:bg-sn-green inline-block rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium transition-colors hover:text-white dark:border-neutral-700"
                      >
                        #{tag.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8">
              <AdSlot slot={media.ad} format="in-article" />
            </div>

            {articles.related.length > 0 && (
              <section className="mt-12" aria-labelledby="related-title">
                <h2
                  id="related-title"
                  className="font-display mb-5 border-b-2 border-neutral-900 pb-2 text-lg font-extrabold uppercase tracking-tight dark:border-neutral-100"
                >
                  À lire également
                </h2>
                <div className="grid gap-6 sm:grid-cols-3">
                  {articles.related.map((item) => (
                    <ArticleCard
                      key={item.id}
                      article={item}
                      variant="standard"
                      showExcerpt={false}
                    />
                  ))}
                </div>
              </section>
            )}
          </article>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <AdSlot slot={media.ad} format="rectangle" />

              <section className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-800">
                <h2 className="font-ui text-xs font-bold uppercase tracking-wider text-neutral-500">
                  À propos de l&apos;auteur
                </h2>
                <div className="mt-3 flex items-start gap-3">
                  <span className="bg-sn-green flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white">
                    {initials(authorName)}
                  </span>
                  <div>
                    <p className="font-semibold">{authorName}</p>
                    <p className="text-xs text-neutral-500">Journaliste — SENCOURRIER</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Suit l&apos;actualité nationale et régionale pour la rédaction de SENCOURRIER.
                </p>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
