import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaClient } from '@sencourrier/database';
import {
  ArticleStatus,
  NewsletterStatus,
  RevisionAction,
  SubscriptionStatus,
} from '@sencourrier/types';
import { PRISMA } from '../../infra/prisma/prisma.module';
import { RedisService } from '../../infra/redis/redis.service';
import { AnalyticsService } from '../analytics/analytics.service';

/**
 * Tâches planifiées de la rédaction.
 *
 * Regroupées dans un seul service : chacune est idempotente et peut être
 * relancée sans effet de bord, ce qui rend le redémarrage d'une instance
 * Azure totalement sûr.
 */
@Injectable()
export class EditorialScheduler {
  private readonly logger = new Logger(EditorialScheduler.name);

  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly redis: RedisService,
    private readonly analytics: AnalyticsService,
  ) {}

  /** Publie les articles dont l'heure de programmation est atteinte. */
  @Cron(CronExpression.EVERY_MINUTE, { name: 'publish-scheduled-articles' })
  async publishScheduled(): Promise<void> {
    const due = await this.prisma.article.findMany({
      where: {
        status: ArticleStatus.SCHEDULED,
        scheduledAt: { lte: new Date() },
        deletedAt: null,
      },
      select: { id: true, title: true, excerpt: true, bodyHtml: true },
    });

    if (due.length === 0) return;

    for (const article of due) {
      await this.prisma.article.update({
        where: { id: article.id },
        data: {
          status: ArticleStatus.PUBLISHED,
          publishedAt: new Date(),
          scheduledAt: null,
          revisions: {
            create: {
              action: RevisionAction.PUBLISHED,
              title: article.title,
              excerpt: article.excerpt,
              bodyHtml: article.bodyHtml,
              status: ArticleStatus.PUBLISHED,
              comment: 'Publication automatique (programmation)',
            },
          },
        },
      });
    }

    await this.redis.delByPrefix('articles:');
    this.logger.log(`${due.length} article(s) publié(s) depuis la programmation.`);
  }

  /** Archive les articles dont la durée de vie éditoriale est dépassée. */
  @Cron(CronExpression.EVERY_HOUR, { name: 'expire-articles' })
  async expireArticles(): Promise<void> {
    const { count } = await this.prisma.article.updateMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        expiresAt: { lte: new Date() },
        deletedAt: null,
      },
      data: { status: ArticleStatus.ARCHIVED },
    });

    if (count > 0) {
      await this.redis.delByPrefix('articles:');
      this.logger.log(`${count} article(s) archivé(s) après expiration.`);
    }
  }

  /** Clôture les abonnements arrivés à échéance sans renouvellement. */
  @Cron(CronExpression.EVERY_DAY_AT_1AM, { name: 'close-expired-subscriptions' })
  async closeSubscriptions(): Promise<void> {
    const { count } = await this.prisma.subscription.updateMany({
      where: {
        status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING] },
        currentPeriodEnd: { lte: new Date() },
      },
      data: { status: SubscriptionStatus.EXPIRED },
    });

    if (count > 0) this.logger.log(`${count} abonnement(s) expiré(s).`);
  }

  /** Purge les jetons de rafraîchissement expirés (hygiène de la base). */
  @Cron(CronExpression.EVERY_DAY_AT_3AM, { name: 'purge-refresh-tokens' })
  async purgeRefreshTokens(): Promise<void> {
    const { count } = await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });

    if (count > 0) this.logger.log(`${count} jeton(s) de session purgé(s).`);
  }

  /** Nettoie les inscriptions newsletter jamais confirmées (double opt-in). */
  @Cron(CronExpression.EVERY_DAY_AT_4AM, { name: 'purge-pending-subscribers' })
  async purgePendingSubscribers(): Promise<void> {
    const cutoff = new Date(Date.now() - 30 * 86_400_000);
    const { count } = await this.prisma.newsletterSubscriber.deleteMany({
      where: { status: NewsletterStatus.PENDING, createdAt: { lte: cutoff } },
    });

    if (count > 0) this.logger.log(`${count} inscription(s) non confirmée(s) supprimée(s).`);
  }

  /** Consolidation analytique quotidienne à 00 h 30 (métriques de la veille). */
  @Cron('30 0 * * *', { name: 'analytics-rollup' })
  async rollupAnalytics(): Promise<void> {
    await this.analytics.rollupDaily();
    this.logger.log('Métriques quotidiennes consolidées.');
  }
}
