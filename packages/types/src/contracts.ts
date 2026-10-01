/** Shared DTO contracts between the NestJS API and the Next.js client. */

import type {
  AdSlotPlacement,
  ArticleFormat,
  ArticleStatus,
  CommentStatus,
  MediaProvider,
  MediaType,
  NewsletterStatus,
  NotificationChannel,
  PaymentProvider,
  PaymentStatus,
  SubscriptionStatus,
  SubscriptionTier,
} from './enums';
import type { Role } from './roles';

export interface ApiResponse<T> {
  data: T;
  meta?: PageMeta;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
  path?: string;
  timestamp: string;
}

export interface PageMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface AuthorSummary {
  id: string;
  slug: string;
  displayName: string;
  avatarUrl: string | null;
  jobTitle: string | null;
  bio: string | null;
  role: Role;
  twitterHandle: string | null;
}

export interface MediaAsset {
  id: string;
  type: MediaType;
  provider: MediaProvider;
  url: string;
  thumbnailUrl: string | null;
  caption: string | null;
  credit: string | null;
  width: number | null;
  height: number | null;
  durationSeconds: number | null;
  altText: string | null;
}

export interface CategoryRef {
  id: string;
  slug: string;
  name: string;
  parentSlug: string | null;
}

export interface TagRef {
  id: string;
  slug: string;
  name: string;
}

export interface ArticleSummary {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  format: ArticleFormat;
  status: ArticleStatus;
  isPremium: boolean;
  isBreaking: boolean;
  readingMinutes: number;
  publishedAt: string | null;
  updatedAt: string;
  heroImage: MediaAsset | null;
  author: AuthorSummary | null;
  category: CategoryRef | null;
  tags: TagRef[];
  viewCount: number;
  commentCount: number;
  /** URL path relative to the site root, e.g. `/politique/mon-article-abc123`. */
  permalink: string;
}

export interface ArticleDetail extends ArticleSummary {
  /** Sanitised HTML body produced by the editor. */
  bodyHtml: string;
  /** Plain-text body, used by the search index and the AI summariser. */
  bodyText: string;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  noIndex: boolean;
  related: ArticleSummary[];
  gallery: MediaAsset[];
  /** True when the body was withheld because the reader lacks entitlement. */
  paywalled: boolean;
}

export interface CommentDto {
  id: string;
  body: string;
  status: CommentStatus;
  createdAt: string;
  authorName: string;
  authorAvatarUrl: string | null;
  parentId: string | null;
  replies?: CommentDto[];
}

export interface LiveBlogEntry {
  id: string;
  bodyHtml: string;
  isPinned: boolean;
  publishedAt: string;
  authorName: string;
}

export interface PodcastEpisodeDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  seasonNumber: number | null;
  episodeNumber: number | null;
  audioUrl: string;
  durationSeconds: number;
  coverImageUrl: string | null;
  publishedAt: string;
  isPremium: boolean;
  show: { id: string; slug: string; name: string; coverImageUrl: string | null };
}

export interface VideoDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  provider: MediaProvider;
  embedUrl: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  publishedAt: string;
  isPremium: boolean;
}

export interface SubscriptionPlanDto {
  id: string;
  tier: SubscriptionTier;
  name: string;
  description: string;
  /** Price in the smallest currency unit (XOF has no decimals, so this is FCFA). */
  priceAmount: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  isPopular: boolean;
  stripePriceId: string | null;
}

export interface SubscriptionDto {
  id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  provider: PaymentProvider | null;
}

export interface PaymentDto {
  id: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: string;
  reference: string;
  createdAt: string;
}

export interface AdSlotDto {
  id: string;
  name: string;
  placement: AdSlotPlacement;
  imageUrl: string | null;
  targetUrl: string | null;
  htmlSnippet: string | null;
  isActive: boolean;
}

export interface NewsletterSubscriptionDto {
  id: string;
  email: string;
  status: NewsletterStatus;
  interests: string[];
}

export interface NotificationDto {
  id: string;
  title: string;
  body: string;
  url: string | null;
  channel: NotificationChannel;
  readAt: string | null;
  createdAt: string;
}

export interface UserProfileDto {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: Role;
  bio: string | null;
  createdAt: string;
  subscription: SubscriptionDto | null;
  preferences: {
    darkMode: boolean;
    breakingNewsAlerts: boolean;
    weeklyDigest: boolean;
    preferredCategories: string[];
  };
}

export interface AuthorDashboardStats {
  publishedCount: number;
  draftCount: number;
  pendingReviewCount: number;
  totalViews: number;
  averageReadingMinutes: number;
}

export interface AnalyticsOverviewDto {
  range: { from: string; to: string };
  visitors: number;
  pageViews: number;
  averageSessionSeconds: number;
  bounceRate: number;
  newSubscribers: number;
  recurringRevenue: number;
  topArticles: Array<{ id: string; title: string; permalink: string; views: number }>;
  trafficSources: Array<{ source: string; visitors: number }>;
  topCountries: Array<{ country: string; visitors: number }>;
}

export interface SearchHit {
  id: string;
  type: 'article' | 'podcast' | 'video' | 'author';
  title: string;
  excerpt: string;
  permalink: string;
  publishedAt: string | null;
  thumbnailUrl: string | null;
  categoryName: string | null;
  score: number;
  highlights: Record<string, string[]>;
}

export interface SearchResultDto {
  query: string;
  total: number;
  tookMs: number;
  hits: SearchHit[];
  facets: {
    categories: Array<{ slug: string; name: string; count: number }>;
    types: Array<{ type: string; count: number }>;
    years: Array<{ year: number; count: number }>;
  };
  suggestions: string[];
}

export interface AiSummaryDto {
  scope: 'daily' | 'article' | 'category';
  headline: string;
  summary: string;
  bulletPoints: string[];
  sources: Array<{ title: string; permalink: string }>;
  generatedAt: string;
  model: string;
}

export interface AiChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: Array<{ title: string; permalink: string }>;
}

export interface AiChatResponseDto {
  message: AiChatMessage;
  conversationId: string;
  usage: { promptTokens: number; completionTokens: number };
}
