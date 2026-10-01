import { BRAND } from './brand';

/** Canonical public URLs — never hardcode a domain anywhere else. */
const DEFAULT_SITE_URL = 'https://www.sencourrier.sn';

// Une variable définie mais vide (`NEXT_PUBLIC_SITE_URL=`) ne doit pas écraser
// la valeur par défaut : `new URL('')` lèverait une exception au rendu.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL
).replace(/\/$/, '');

export const SITE = {
  url: SITE_URL,
  name: BRAND.name,
  tagline: BRAND.tagline,
  description: BRAND.description,
  locale: BRAND.language,
  defaultOgImage: `${SITE_URL}/images/og-default.jpg`,
  logo: `${SITE_URL}/logo.svg`,
  twitterHandle: '@sencourrier',
  publisherLogo: `${SITE_URL}/images/logo-square.png`,
  themeColor: '#00853F',
  backgroundColor: '#FFFFFF',
} as const;

export const ROUTES = {
  home: '/',
  search: '/recherche',
  tvLive: '/tv-live',
  podcasts: '/podcasts',
  videos: '/videos',
  premium: '/abonnement',
  login: '/connexion',
  register: '/inscription',
  forgotPassword: '/mot-de-passe-oublie',
  account: '/compte',
  accountDashboard: '/compte/tableau-de-bord',
  accountBookmarks: '/compte/favoris',
  accountHistory: '/compte/historique',
  accountSettings: '/compte/parametres',
  accountNotifications: '/compte/notifications',
  author: (slug: string) => `/auteurs/${slug}`,
  category: (slug: string) => `/${slug}`,
  article: (categorySlug: string, slug: string) => `/${categorySlug}/${slug}`,
  tag: (slug: string) => `/tags/${slug}`,
  legalNotice: '/mentions-legales',
  privacy: '/politique-confidentialite',
  terms: '/cgu',
  salesTerms: '/cgv',
  cookies: '/cookies',
  about: '/a-propos',
  contact: '/contact',
  editorialCharter: '/charte-editoriale',
  newsroom: '/redaction',
  rss: '/rss.xml',
  sitemap: '/sitemap.xml',
  newsSitemap: '/news-sitemap.xml',
  ads: '/publicite',
} as const;

export const NAV_PRIMARY = [
  { slug: 'politique', name: 'Politique' },
  { slug: 'societe', name: 'Société' },
  { slug: 'economie', name: 'Économie' },
  { slug: 'sports', name: 'Sports' },
  { slug: 'technologies', name: 'Technologies' },
  { slug: 'international', name: 'International' },
  { slug: 'diaspora', name: 'Diaspora' },
  { slug: 'faits-divers', name: 'Faits divers' },
] as const;

export const NAV_MEDIA = [
  { href: ROUTES.tvLive, name: 'TV Live' },
  { href: ROUTES.podcasts, name: 'Podcasts' },
  { href: ROUTES.videos, name: 'Vidéos' },
] as const;

export const FOOTER_LEGAL = [
  { href: ROUTES.about, name: 'À propos' },
  { href: ROUTES.newsroom, name: 'La rédaction' },
  { href: ROUTES.editorialCharter, name: 'Charte éditoriale' },
  { href: ROUTES.contact, name: 'Contact' },
  { href: ROUTES.ads, name: 'Publicité' },
  { href: ROUTES.legalNotice, name: 'Mentions légales' },
  { href: ROUTES.privacy, name: 'Politique de confidentialité' },
  { href: ROUTES.cookies, name: 'Cookies' },
  { href: ROUTES.terms, name: 'CGU' },
  { href: ROUTES.salesTerms, name: 'CGV' },
] as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const ARTICLE_PERMALINK_TTL_SECONDS = 300;
export const BREAKING_NEWS_TTL_SECONDS = 30;
