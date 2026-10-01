/** Editorial lifecycle of an article. */
export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  REJECTED = 'REJECTED',
}

export const ARTICLE_STATUS_LABELS: Record<ArticleStatus, string> = {
  [ArticleStatus.DRAFT]: 'Brouillon',
  [ArticleStatus.PENDING_REVIEW]: 'En attente de validation',
  [ArticleStatus.APPROVED]: 'Validé',
  [ArticleStatus.SCHEDULED]: 'Programmé',
  [ArticleStatus.PUBLISHED]: 'Publié',
  [ArticleStatus.ARCHIVED]: 'Archivé',
  [ArticleStatus.REJECTED]: 'Refusé',
};

/** Statuses that may be rendered on the public website. */
export const PUBLIC_ARTICLE_STATUSES: readonly ArticleStatus[] = [ArticleStatus.PUBLISHED];

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
}

export enum MediaProvider {
  AZURE_BLOB = 'AZURE_BLOB',
  YOUTUBE = 'YOUTUBE',
  VIMEO = 'VIMEO',
  EXTERNAL = 'EXTERNAL',
}

export enum ArticleFormat {
  STANDARD = 'STANDARD',
  LIVE = 'LIVE',
  ANALYSIS = 'ANALYSIS',
  INTERVIEW = 'INTERVIEW',
  OPINION = 'OPINION',
  PHOTO_ESSAY = 'PHOTO_ESSAY',
  VIDEO_REPORT = 'VIDEO_REPORT',
}

export enum CommentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SPAM = 'SPAM',
}

export enum SubscriptionTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  PREMIUM_ANNUAL = 'PREMIUM_ANNUAL',
  PRESS_PRO = 'PRESS_PRO',
}

export enum SubscriptionStatus {
  TRIALING = 'TRIALING',
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
}

/** Payment rails supported for the Senegalese and diaspora markets. */
export enum PaymentProvider {
  STRIPE = 'STRIPE',
  WAVE = 'WAVE',
  ORANGE_MONEY = 'ORANGE_MONEY',
  FREE_MONEY = 'FREE_MONEY',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum AdSlotPlacement {
  HEADER_LEADERBOARD = 'HEADER_LEADERBOARD',
  SIDEBAR_TOP = 'SIDEBAR_TOP',
  SIDEBAR_MIDDLE = 'SIDEBAR_MIDDLE',
  IN_ARTICLE = 'IN_ARTICLE',
  IN_FEED = 'IN_FEED',
  FOOTER = 'FOOTER',
  STICKY_MOBILE = 'STICKY_MOBILE',
}

export enum NewsletterStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
  BOUNCED = 'BOUNCED',
}

export enum NotificationChannel {
  WEB_PUSH = 'WEB_PUSH',
  EMAIL = 'EMAIL',
  IN_APP = 'IN_APP',
}

export enum NotificationKind {
  BREAKING_NEWS = 'BREAKING_NEWS',
  NEW_ARTICLE = 'NEW_ARTICLE',
  NEWSLETTER = 'NEWSLETTER',
  COMMENT_REPLY = 'COMMENT_REPLY',
  SUBSCRIPTION = 'SUBSCRIPTION',
  SYSTEM = 'SYSTEM',
}

/** Trace of every editorial change made to an article. */
export enum RevisionAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  UNPUBLISHED = 'UNPUBLISHED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}

export enum ModerationDecision {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SPAM = 'SPAM',
}
