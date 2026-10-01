import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@sencourrier/database';
import { ArticleStatus } from '@sencourrier/types';
import { createHash } from 'node:crypto';
import { PRISMA } from '../../infra/prisma/prisma.module';
import { RedisService } from '../../infra/redis/redis.service';
import { buildPagination } from '../../common/interceptors/pagination.interceptor';

/**
 * Expression SQL normalisée d'une colonne : minuscules + suppression des
 * diacritiques, pour que « Senegal » trouve « Sénégal ».
 *
 * Elle doit rester identique à l'expression indexée par
 * `articles_title_unaccent_trgm_idx` (migration
 * `20260930200000_editorial_search_indexes`) : toute divergence ferait perdre
 * le bénéfice de l'index.
 */
const norm = (column: Prisma.Sql): Prisma.Sql =>
  Prisma.sql`lower(public.sencourrier_unaccent(${column}))`;

const normPattern = (term: string): Prisma.Sql =>
  Prisma.sql`lower(public.sencourrier_unaccent(${term}))`;

export interface SearchResultItem {
  type: 'article' | 'author' | 'tag' | 'category';
  title: string;
  slug: string;
  excerpt?: string | null;
  category?: string | null;
  publishedAt?: Date | null;
  score: number;
}

export interface SearchQuery {
  q: string;
  page: number;
  perPage: number;
  category?: string;
  type?: 'article' | 'author' | 'tag' | 'category';
}

@Injectable()
export class SearchService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Recherche plein texte.
   *
   * Elasticsearch prend le relais dès qu'il est activé (`ELASTICSEARCH_ENABLED`) ;
   * en attendant, PostgreSQL assure la recherche avec `tsvector` et un repli
   * `ILIKE` pour les requêtes partielles en cours de frappe.
   */
  async search(query: SearchQuery) {
    const term = query.q.trim();
    if (term.length < 2) {
      return { data: [], meta: buildPagination(query.page, query.perPage, 0) };
    }

    const cacheKey = `search:${createHash('sha1').update(JSON.stringify(query)).digest('hex')}`;
    const cached = await this.redis.get<{ data: SearchResultItem[]; meta: unknown }>(cacheKey);
    if (cached) return cached;

    const results =
      query.type === 'author'
        ? await this.searchAuthors(term, query)
        : query.type === 'tag'
          ? await this.searchTags(term, query)
          : await this.searchArticles(term, query);

    const payload = {
      data: results.items,
      meta: buildPagination(query.page, query.perPage, results.total),
    };

    await this.redis.set(cacheKey, payload, 120);
    void this.logQuery(term, results.total);

    return payload;
  }

  /** Suggestions instantanées pour la barre de recherche. */
  async suggest(term: string, limit = 8) {
    const trimmed = term.trim();
    if (trimmed.length < 2) return [];

    const pattern = `%${trimmed}%`;

    const [articles, tags] = await Promise.all([
      this.prisma.$queryRaw<
        Array<{ slug: string; title: string; categoryName: string | null }>
      >(Prisma.sql`
        SELECT a."slug", a."title", c."name" AS "categoryName"
        FROM "articles" a
        LEFT JOIN "categories" c ON c."id" = a."categoryId"
        WHERE a."status" = ${ArticleStatus.PUBLISHED}::"ArticleStatus"
          AND a."deletedAt" IS NULL
          AND a."publishedAt" <= now()
          AND ${norm(Prisma.sql`a."title"`)} LIKE ${normPattern(pattern)}
        ORDER BY a."publishedAt" DESC
        LIMIT ${limit}
      `),
      this.prisma.$queryRaw<Array<{ slug: string; name: string }>>(Prisma.sql`
        SELECT t."slug", t."name"
        FROM "tags" t
        WHERE ${norm(Prisma.sql`t."name"`)} LIKE ${normPattern(pattern)}
        ORDER BY t."usageCount" DESC
        LIMIT 4
      `),
    ]);

    return [
      ...articles.map((article) => ({
        type: 'article' as const,
        slug: article.slug,
        title: article.title,
        category: article.categoryName,
      })),
      ...tags.map((tag) => ({
        type: 'tag' as const,
        slug: tag.slug,
        title: tag.name,
        category: null,
      })),
    ];
  }

  async popularSearches(limit = 8) {
    const rows = await this.prisma.searchQueryLog.groupBy({
      by: ['query'],
      _count: { query: true },
      orderBy: { _count: { query: 'desc' } },
      take: limit,
    });

    return rows.map((row) => ({ query: row.query, count: row._count.query }));
  }

  private async searchArticles(term: string, query: SearchQuery) {
    const categoryFilter = query.category
      ? Prisma.sql`AND c."slug" = ${query.category}`
      : Prisma.empty;

    // Le classement place les titres avant les chapôs avant le corps du texte,
    // puis les publications récentes : la requête SQL est écrite à la main car
    // Prisma ne sait pas exprimer un tri pondéré multi-colonnes.
    const where = Prisma.sql`
      a."status" = ${ArticleStatus.PUBLISHED}::"ArticleStatus"
      AND a."deletedAt" IS NULL
      AND a."publishedAt" <= now()
      ${categoryFilter}
      AND (
        ${norm(Prisma.sql`a."title"`)} LIKE ${normPattern(`%${term}%`)}
        OR ${norm(Prisma.sql`a."excerpt"`)} LIKE ${normPattern(`%${term}%`)}
        OR ${norm(Prisma.sql`a."bodyText"`)} LIKE ${normPattern(`%${term}%`)}
        OR EXISTS (
          SELECT 1 FROM "article_tags" at
          JOIN "tags" t ON t."id" = at."tagId"
          WHERE at."articleId" = a."id"
            AND ${norm(Prisma.sql`t."name"`)} LIKE ${normPattern(`%${term}%`)}
        )
      )
    `;

    const [rows, totalRows] = await Promise.all([
      this.prisma.$queryRaw<
        Array<{
          slug: string;
          title: string;
          excerpt: string;
          publishedAt: Date | null;
          isPremium: boolean;
          categoryName: string | null;
          score: number;
        }>
      >(Prisma.sql`
        SELECT
          a."slug",
          a."title",
          a."excerpt",
          a."publishedAt",
          a."isPremium",
          c."name" AS "categoryName",
          (
            CASE WHEN ${norm(Prisma.sql`a."title"`)} LIKE ${normPattern(`%${term}%`)} THEN 3 ELSE 0 END
            + CASE WHEN ${norm(Prisma.sql`a."excerpt"`)} LIKE ${normPattern(`%${term}%`)} THEN 2 ELSE 0 END
            + CASE WHEN ${norm(Prisma.sql`a."bodyText"`)} LIKE ${normPattern(`%${term}%`)} THEN 1 ELSE 0 END
          ) AS "score"
        FROM "articles" a
        LEFT JOIN "categories" c ON c."id" = a."categoryId"
        WHERE ${where}
        ORDER BY "score" DESC, a."publishedAt" DESC
        LIMIT ${query.perPage} OFFSET ${(query.page - 1) * query.perPage}
      `),
      this.prisma.$queryRaw<Array<{ count: bigint }>>(Prisma.sql`
        SELECT COUNT(*)::bigint AS "count"
        FROM "articles" a
        LEFT JOIN "categories" c ON c."id" = a."categoryId"
        WHERE ${where}
      `),
    ]);

    return {
      total: Number(totalRows[0]?.count ?? 0),
      items: rows.map<SearchResultItem>((row) => ({
        type: 'article',
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        category: row.categoryName,
        publishedAt: row.publishedAt,
        score: Number(row.score),
      })),
    };
  }

  private async searchAuthors(term: string, query: SearchQuery) {
    const where = { displayName: { contains: term, mode: 'insensitive' as const } };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.authorProfile.findMany({
        where,
        orderBy: { articleCount: 'desc' },
        skip: (query.page - 1) * query.perPage,
        take: query.perPage,
        select: { slug: true, displayName: true, jobTitle: true, bio: true },
      }),
      this.prisma.authorProfile.count({ where }),
    ]);

    return {
      total,
      items: rows.map<SearchResultItem>((row) => ({
        type: 'author',
        slug: row.slug,
        title: row.displayName,
        excerpt: row.jobTitle ?? row.bio,
        score: 1,
      })),
    };
  }

  private async searchTags(term: string, query: SearchQuery) {
    const where = { name: { contains: term, mode: 'insensitive' as const } };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.tag.findMany({
        where,
        orderBy: { usageCount: 'desc' },
        skip: (query.page - 1) * query.perPage,
        take: query.perPage,
        select: { slug: true, name: true, usageCount: true },
      }),
      this.prisma.tag.count({ where }),
    ]);

    return {
      total,
      items: rows.map<SearchResultItem>((row) => ({
        type: 'tag',
        slug: row.slug,
        title: row.name,
        score: row.usageCount,
      })),
    };
  }

  /**
   * Journalisation anonymisée : aucune adresse IP n'est conservée, seule la
   * requête et le nombre de résultats le sont (conformité RGPD).
   */
  private async logQuery(query: string, resultCount: number): Promise<void> {
    try {
      await this.prisma.searchQueryLog.create({ data: { query, resultCount } });
    } catch {
      // La journalisation ne doit jamais faire échouer une recherche.
    }
  }
}
