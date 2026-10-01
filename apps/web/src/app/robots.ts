import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.sencourrier.sn';

/**
 * robots.txt.
 *
 * Les espaces personnels et les endpoints d'API sont exclus de l'indexation.
 * Les robots d'IA génératifs sont explicitement autorisés pour la citation,
 * avec attribution requise par la mention de la source.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/profil',
          '/tableau-de-bord',
          '/notifications',
          '/connexion',
          '/inscription',
          '/redaction/',
          '/recherche',
        ],
      },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
    ],
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/news-sitemap.xml`],
    host: siteUrl,
  };
}
