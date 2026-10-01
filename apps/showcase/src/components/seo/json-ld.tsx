import { SITE } from '@sencourrier/config';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.sencourrier.sn';

/**
 * Données structurées Schema.org.
 * Rendu via un script `application/ld+json` : format attendu par Google News
 * et Google Search pour les rich results.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Les données proviennent de la base éditoriale, jamais d'une saisie
      // utilisateur non validée.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: SITE.name,
    url: siteUrl,
    logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.svg`, width: 512, height: 512 },
    slogan: SITE.tagline,
    description: SITE.description,
    address: { '@type': 'PostalAddress', addressCountry: 'SN', addressLocality: 'Dakar' },
    sameAs: [
      'https://www.facebook.com/sencourrier',
      'https://twitter.com/sencourrier',
      'https://www.youtube.com/@sencourrier',
    ],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: siteUrl,
    inLanguage: 'fr-SN',
    publisher: { '@type': 'NewsMediaOrganization', name: SITE.name },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/recherche?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function newsArticleSchema(article: {
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
  isPremium: boolean;
  readingMinutes: number;
  wordCount: number;
  heroImage: {
    url: string;
    width: number | null;
    height: number | null;
    altText: string | null;
  } | null;
  category: { slug: string; name: string } | null;
  tags: string[];
  authors: { name: string; url: string | null; jobTitle: string | null }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/article/${article.slug}` },
    headline: article.title.slice(0, 110),
    alternativeHeadline: article.subtitle ?? undefined,
    description: article.excerpt ?? undefined,
    articleSection: article.category?.name,
    keywords: article.tags.join(', '),
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    inLanguage: 'fr-SN',
    wordCount: article.wordCount,
    timeRequired: `PT${article.readingMinutes}M`,
    isAccessibleForFree: !article.isPremium,
    image: article.heroImage
      ? [
          {
            '@type': 'ImageObject',
            url: article.heroImage.url,
            width: article.heroImage.width ?? undefined,
            height: article.heroImage.height ?? undefined,
            caption: article.heroImage.altText ?? article.title,
          },
        ]
      : undefined,
    author: article.authors.map((author) => ({
      '@type': 'Person',
      name: author.name,
      url: author.url ?? undefined,
      jobTitle: author.jobTitle ?? undefined,
    })),
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.svg` },
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

export function itemListSchema(articles: { slug: string; title: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: articles.map((article, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteUrl}/article/${article.slug}`,
      name: article.title,
    })),
  };
}
