import { prisma } from '@/lib/db';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.sencourrier.sn';

/**
 * Sitemap Google News.
 *
 * Google n'accepte que les articles publiés dans les 48 dernières heures et
 * limite le fichier à 1 000 URL. Le format respecte la spécification
 * news sitemap (`news:news`, `news:publication`, `news:publication_date`).
 */
export async function GET(): Promise<Response> {
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000);

  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED', deletedAt: null, publishedAt: { gte: since } },
    select: { slug: true, title: true, publishedAt: true, category: { select: { name: true } } },
    orderBy: { publishedAt: 'desc' },
    take: 1000,
  });

  const entries = articles
    .map(
      (article) => `    <url>
      <loc>${siteUrl}/article/${article.slug}</loc>
      <news:news>
        <news:publication>
          <news:name>SENCOURRIER</news:name>
          <news:language>fr</news:language>
        </news:publication>
        <news:publication_date>${article.publishedAt?.toISOString()}</news:publication_date>
        <news:title>${escapeXml(article.title)}</news:title>${
          article.category
            ? `\n        <news:keywords>${escapeXml(article.category.name)}</news:keywords>`
            : ''
        }
      </news:news>
    </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=900, s-maxage=900, stale-while-revalidate=3600',
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
