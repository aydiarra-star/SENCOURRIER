/**
 * Formes de l'instantané de démonstration.
 *
 * L'instantané est un fichier JSON : TypeScript y voit des chaînes, alors que
 * les composants attendent de vraies `Date`. Ces types décrivent la forme
 * attendue après revivification (voir `lib/data.ts`).
 */

/** Carte d'article, telle qu'attendue par `ArticleCard`. */
export interface Card {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  isPremium: boolean;
  isBreaking: boolean;
  isFeatured: boolean;
  format: string;
  readingMinutes: number;
  viewCount: number;
  commentCount: number;
  publishedAt: Date | null;
  category: {
    id: string;
    slug: string;
    name: string;
    shortName: string | null;
    accent: string;
  } | null;
  heroImage: {
    url: string;
    thumbnailUrl: string | null;
    altText: string | null;
    width: number | null;
    height: number | null;
  } | null;
  authors: {
    position: number;
    role: string | null;
    user: { id: string; displayName: string | null; name: string | null; image: string | null };
  }[];
}

/** Article complet, avec corps et mots-clés. */
export interface FullArticle extends Card {
  bodyHtml: string | null;
  tags: { tag: { id: string; slug: string; name: string } }[];
}

/** Entrée du fil « dernières minutes ». */
export interface Update {
  id: string;
  slug: string;
  title: string;
  publishedAt: Date | null;
  category: { slug: string; name: string; accent: string } | null;
}

/** Mot-clé tendance. */
export interface TagItem {
  id: string;
  slug: string;
  name: string;
  usageCount: number;
}

/** Émission de podcast et son dernier épisode. */
export interface Show {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  hostName: string | null;
  category: string | null;
  episodeCount: number;
  cover: { url: string; altText: string | null } | null;
  episodes: {
    id: string;
    slug: string;
    title: string;
    durationSeconds: number | null;
    publishedAt: Date | null;
  }[];
}

/** Vidéo. */
export interface VideoItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  durationSeconds: number | null;
  isLive: boolean;
  viewCount: number;
  publishedAt: Date | null;
  thumbnail: { url: string; altText: string | null } | null;
}

/** Bandeau publicitaire. */
export interface AdSlotData {
  id: string;
  name: string;
  imageUrl: string | null;
  targetUrl: string | null;
  htmlSnippet: string | null;
}

/** Rubrique du menu principal. */
export interface NavCategory {
  id: string;
  slug: string;
  name: string;
  shortName: string | null;
  accent: string;
  children: { id: string; slug: string; name: string }[];
}

/** Formule d'abonnement. */
export interface Plan {
  id: string;
  tier: string;
  name: string;
  description: string;
  priceAmount: number;
  currency: string;
  interval: string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  trialDays: number;
  position: number;
}

/** Section thématique de la page d'accueil. */
export interface Section {
  id: string;
  slug: string;
  name: string;
  accent: string;
  articles: Card[];
}

/** Forme d'un résultat de recherche. */
export interface SearchArticleHit {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  isPremium: boolean;
  readingMinutes: number;
  viewCount: number;
  publishedAt: Date | null;
  categorySlug: string | null;
  categoryName: string | null;
  categoryShortName: string | null;
  categoryAccent: string | null;
  heroImageUrl: string | null;
  heroImageThumbnail: string | null;
  heroImageAlt: string | null;
  authorName: string | null;
  authorImage: string | null;
}

/** Instantané complet exporté par `scripts/export-showcase-data.ts`. */
export interface Snapshot {
  generatedAt: string;
  lead: Card | null;
  secondary: Card[];
  featured: Card[];
  breaking: Update[];
  latest: Update[];
  tags: TagItem[];
  podcasts: Show[];
  videos: VideoItem[];
  ad: AdSlotData | null;
  categories: NavCategory[];
  plans: Plan[];
  sections: Section[];
  article: FullArticle | null;
  related: Card[];
}
