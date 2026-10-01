import { prisma } from '@/lib/db';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.sencourrier.sn';

/** Flux RSS 2.0 des dernières publications. */
export async function GET(): Promise<Response> {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED', deletedAt: null },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
      category: { select: { name: true } },
      authors: { select: { user: { select: { displayName: true, name: true } } }, take: 1 },
    },
    orderBy: { publishedAt: 'desc' },
    take: 50,
  });

  const items = articles
    .map((article) => {
      const author =
        article.authors[0]?.user.displayName ?? article.authors[0]?.user.name ?? 'La rédaction';
      const link = `${siteUrl}/article/${article.slug}`;

      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${(article.publishedAt ?? new Date()).toUTCString()}</pubDate>
      <author>redaction@sencourrier.sn (${escapeXml(author)})</author>${
        article.category ? `\n      <category>${escapeXml(article.category.name)}</category>` : ''
      }${article.excerpt ? `\n      <description>${escapeXml(article.excerpt)}</description>` : ''}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SENCOURRIER — Le média numérique de référence du Sénégal</title>
    <link>${siteUrl}</link>
    <description>L'actualité sénégalaise et africaine, en continu.</description>
    <language>fr-sn</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=600, stale-while-revalidate=3600',
    },
  });
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
