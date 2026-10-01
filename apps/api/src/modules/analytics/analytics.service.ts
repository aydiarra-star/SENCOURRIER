import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@sencourrier/database';
import { ArticleStatus, SubscriptionStatus } from '@sencourrier/types';
import { PRISMA } from '../../infra/prisma/prisma.module';
import { RedisService } from '../../infra/redis/redis.service';

export interface TrafficPoint {
  date: string;
  visitors: number;
  pageViews: number;
}

export interface Overview {
  range: { days: number; from: string; to: string };
  totals: {
    visitors: number;
    pageViews: number;
    sessions: number;
    avgSessionMs: number;
    bounceRate: number;
    premiumSubscribers: number;
    revenueXof: number;
    adRevenueXof: number;
    adImpressions: number;
  };
  deltas: {
    visitors: number;
    pageViews: number;
    revenueXof: number;
  };
  traffic: TrafficPoint[];
  topArticles: Array<{ slug: string; title: string; viewCount: number; category: string | null }>;
  trafficSources: Array<{ source: string; sessions: number }>;
  devices: Array<{ deviceType: string; sessions: number }>;
  countries: Array<{ country: string; sessions: number }>;
}

const CACHE_TTL_SECONDS = 300;

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly redis: RedisService,
  ) {}

  /**
   * Tableau de bord de direction.
   *
   * Le calcul agrégé est coûteux : le résultat est mis en cache cinq minutes,
   * ce qui laisse le tableau de bord instantané sans sacrifier la fraîcheur.
   */
  async overview(days = 30): Promise<Overview> {
    const cacheKey = `analytics:overview:${days}`;
    const cached = await this.redis.get<Overview>(cacheKey);
    if (cached) return cached;

    const to = new Date();
    const from = new Date(to.getTime() - days * 86_400_000);
    const previousFrom = new Date(from.getTime() - days * 86_400_000);

    const [current, previous, daily, topArticles, sources, devices, countries, premiumSubscribers, previousTotals] =
      await Promise.all([
        this.aggregateRange(from, to),
        this.aggregateRange(previousFrom, from),
        this.prisma.dailyMetric.findMany({
          where: { date: { gte: from } },
          orderBy: { date: 'asc' },
          select: { date: true, visitors: true, pageViews: true, revenueXof: true, adRevenueXof: true, adImpressions: true, bounceRate: true, avgSessionMs: true, sessions: true },
        }),
        this.prisma.article.findMany({
          where: { status: ArticleStatus.PUBLISHED, deletedAt: null, publishedAt: { gte: from } },
          orderBy: { viewCount: 'desc' },
          take: 10,
          select: { slug: true, title: true, viewCount: true, category: { select: { name: true } } },
        }),
        this.prisma.pageViewEvent.groupBy({
          by: ['source'],
          where: { createdAt: { gte: from } },
          _count: { _all: true },
          orderBy: { _count: { source: 'desc' } },
          take: 10,
        }),
        this.prisma.pageViewEvent.groupBy({
          by: ['deviceType'],
          where: { createdAt: { gte: from } },
          _count: { _all: true },
          orderBy: { _count: { deviceType: 'desc' } },
          take: 5,
        }),
        this.prisma.pageViewEvent.groupBy({
          by: ['country'],
          where: { createdAt: { gte: from } },
          _count: { _all: true },
          orderBy: { _count: { country: 'desc' } },
          take: 10,
        }),
        this.prisma.subscription.count({
          where: { status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING] } },
        }),
        this.prisma.dailyMetric.aggregate({
          where: { date: { gte: previousFrom, lt: from } },
          _sum: { revenueXof: true },
        }),
      ]);

    const totals = daily.reduce(
      (accumulator, day) => ({
        visitors: accumulator.visitors + day.visitors,
        pageViews: accumulator.pageViews + day.pageViews,
        sessions: accumulator.sessions + day.sessions,
        avgSessionMs: accumulator.avgSessionMs + day.avgSessionMs,
        bounceRate: accumulator.bounceRate + day.bounceRate,
        revenueXof: accumulator.revenueXof + day.revenueXof,
        adRevenueXof: accumulator.adRevenueXof + day.adRevenueXof,
        adImpressions: accumulator.adImpressions + day.adImpressions,
      }),
      { visitors: 0, pageViews: 0, sessions: 0, avgSessionMs: 0, bounceRate: 0, revenueXof: 0, adRevenueXof: 0, adImpressions: 0 },
    );

    const dayCount = daily.length || 1;
    const overview: Overview = {
      range: { days, from: from.toISOString(), to: to.toISOString() },
      totals: {
        visitors: totals.visitors || current.visitors,
        pageViews: totals.pageViews || current.pageViews,
        sessions: totals.sessions || current.sessions,
        avgSessionMs: Math.round(totals.avgSessionMs / dayCount),
        bounceRate: Number((totals.bounceRate / dayCount).toFixed(3)),
        premiumSubscribers,
        revenueXof: totals.revenueXof,
        adRevenueXof: totals.adRevenueXof,
        adImpressions: totals.adImpressions,
      },
      deltas: {
        visitors: percentDelta(current.visitors, previous.visitors),
        pageViews: percentDelta(current.pageViews, previous.pageViews),
        revenueXof: percentDelta(totals.revenueXof, previousTotals._sum.revenueXof ?? 0),
      },
      traffic: daily.map((day) => ({
        date: day.date.toISOString().slice(0, 10),
        visitors: day.visitors,
        pageViews: day.pageViews,
      })),
      topArticles: topArticles.map((article) => ({
        slug: article.slug,
        title: article.title,
        viewCount: article.viewCount,
        category: article.category?.name ?? null,
      })),
      trafficSources: sources.map((row) => ({ source: row.source ?? 'direct', sessions: row._count._all })),
      devices: devices.map((row) => ({ deviceType: row.deviceType ?? 'inconnu', sessions: row._count._all })),
      countries: countries.map((row) => ({ country: row.country ?? 'inconnu', sessions: row._count._all })),
    };

    await this.redis.set(cacheKey, overview, CACHE_TTL_SECONDS);
    return overview;
  }

  /** Séries prêtes à afficher pour les graphiques du back-office. */
  async timeseries(metric: 'visitors' | 'pageViews' | 'revenueXof' | 'adRevenueXof', days = 90) {
    const from = new Date(Date.now() - days * 86_400_000);
    const rows = await this.prisma.dailyMetric.findMany({
      where: { date: { gte: from } },
      orderBy: { date: 'asc' },
      select: { date: true, [metric]: true },
    });

    return rows.map((row) => ({
      date: (row.date as Date).toISOString().slice(0, 10),
      value: Number((row as Record<string, unknown>)[metric] ?? 0),
    }));
  }

  /**
   * Enregistre une vue de page.
   *
   * Le trafic est traité de façon best-effort : une visite perdue est
   * préférable à une requête publique ralentie par l'analytique.
   */
  async trackPageView(input: {
    sessionId: string;
    userId?: string;
    path: string;
    articleId?: string;
    referrer?: string;
    source?: string;
    medium?: string;
    campaign?: string;
    country?: string;
    deviceType?: string;
    browser?: string;
    os?: string;
    language?: string;
  }): Promise<void> {
    try {
      await this.prisma.pageViewEvent.create({
        data: {
          sessionId: input.sessionId,
          userId: input.userId,
          path: input.path,
          articleId: input.articleId,
          referrer: input.referrer,
          source: input.source,
          medium: input.medium,
          campaign: input.campaign,
          country: input.country,
          deviceType: input.deviceType,
          browser: input.browser,
          os: input.os,
          language: input.language,
        },
      });
    } catch {
      // Ignoré volontairement.
    }
  }

  /** Consolidation nocturne : alimente `daily_metrics` depuis les événements bruts. */
  async rollupDaily(date = new Date(Date.now() - 86_400_000)) {
    const dayStart = new Date(date.toISOString().slice(0, 10));
    const dayEnd = new Date(dayStart.getTime() + 86_400_000);

    const [aggregate, topArticleIds] = await Promise.all([
      this.prisma.pageViewEvent.aggregate({
        where: { createdAt: { gte: dayStart, lt: dayEnd } },
        _count: { _all: true },
      }),
      this.prisma.article.findMany({
        where: { status: ArticleStatus.PUBLISHED, publishedAt: { gte: dayStart, lt: dayEnd } },
        orderBy: { viewCount: 'desc' },
        take: 5,
        select: { id: true },
      }),
    ]);

    const sessions = await this.prisma.pageViewEvent.findMany({
      where: { createdAt: { gte: dayStart, lt: dayEnd } },
      distinct: ['sessionId'],
      select: { sessionId: true },
    });

    const metric = await this.prisma.dailyMetric.upsert({
      where: { date: dayStart },
      update: {
        visitors: sessions.length,
        pageViews: aggregate._count._all,
        sessions: sessions.length,
        topArticleIds: topArticleIds.map((article) => article.id),
      },
      create: {
        date: dayStart,
        visitors: sessions.length,
        pageViews: aggregate._count._all,
        sessions: sessions.length,
        topArticleIds: topArticleIds.map((article) => article.id),
      },
    });

    await this.redis.delByPrefix('analytics:');
    return metric;
  }

  private async aggregateRange(from: Date, to: Date) {
    const [events, sessions] = await Promise.all([
      this.prisma.pageViewEvent.count({ where: { createdAt: { gte: from, lt: to } } }),
      this.prisma.pageViewEvent.findMany({
        where: { createdAt: { gte: from, lt: to } },
        distinct: ['sessionId'],
        select: { sessionId: true },
      }),
    ]);

    return { pageViews: events, sessions: sessions.length, visitors: sessions.length };
  }
}

function percentDelta(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}
