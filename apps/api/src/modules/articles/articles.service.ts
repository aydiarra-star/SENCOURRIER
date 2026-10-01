import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@sencourrier/database';
import { ArticleStatus, PUBLIC_ARTICLE_STATUSES, RevisionAction, Role, STAFF_ROLES } from '@sencourrier/types';
import { createHash } from 'node:crypto';
import slugify from 'slugify';
import { PRISMA } from '../../infra/prisma/prisma.module';
import { RedisService } from '../../infra/redis/redis.service';
import type { AuthenticatedUser } from '../../common/decorators/auth.decorators';
import { buildPagination } from '../../common/interceptors/pagination.interceptor';
import type { CreateArticleDto, ListArticlesQueryDto, ModerateArticleDto, UpdateArticleDto } from './dto/article.dto';
import { ARTICLE_CARD_SELECT, toArticleCard } from './article.select';

const ARTICLE_DETAIL_SELECT = {
  ...ARTICLE_CARD_SELECT,
  bodyHtml: true,
  bodyText: true,
  seoTitle: true,
  seoDescription: true,
  canonicalUrl: true,
  focusKeyword: true,
  structuredData: true,
  status: true,
  viewCount: true,
  shareCount: true,
  commentCount: true,
  allowComments: true,
  wordCount: true,
  createdAt: true,
  categoryId: true,
} satisfies Prisma.ArticleSelect;

const CACHE_TTL_SECONDS = 60;
const CACHE_PREFIX = 'articles:';

@Injectable()
export class ArticlesService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly redis: RedisService,
  ) {}

  /** Fil public : seuls les articles publiés et non expirés sont exposés. */
  async listPublic(query: ListArticlesQueryDto) {
    const where: Prisma.ArticleWhereInput = {
      ...this.buildFilters(query),
      status: { in: [...PUBLIC_ARTICLE_STATUSES] },
      deletedAt: null,
      publishedAt: { lte: new Date() },
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    };

    const cacheKey = `${CACHE_PREFIX}list:${createHash('sha1')
      .update(JSON.stringify({ ...query, page: query.page, perPage: query.perPage }))
      .digest('hex')}`;

    const cached = await this.redis.get<{ data: unknown[]; meta: unknown }>(cacheKey);
    if (cached) return cached;

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.article.findMany({
        where,
        select: ARTICLE_CARD_SELECT,
        orderBy: [{ isPinnedToTop: 'desc' }, { publishedAt: 'desc' }],
        skip: query.skip,
        take: query.perPage,
      }),
      this.prisma.article.count({ where }),
    ]);

    const payload = {
      data: rows.map(toArticleCard),
      meta: buildPagination(query.page, query.perPage, total),
    };

    await this.redis.set(cacheKey, payload, CACHE_TTL_SECONDS);
    return payload;
  }

  /** Vue back-office : tous les statuts, avec filtres éditoriaux. */
  async listForStaff(query: ListArticlesQueryDto, user: AuthenticatedUser) {
    const isReviewer = STAFF_ROLES.includes(user.role) && user.role !== Role.JOURNALIST && user.role !== Role.CORRESPONDENT;

    const where: Prisma.ArticleWhereInput = {
      ...this.buildFilters(query),
      deletedAt: null,
      ...(query.status ? { status: query.status } : {}),
      // Un journaliste ne voit que ses propres brouillons.
      ...(!isReviewer ? { authors: { some: { userId: user.id } } } : {}),
    };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.article.findMany({
        where,
        select: ARTICLE_CARD_SELECT,
        orderBy: [{ updatedAt: 'desc' }],
        skip: query.skip,
        take: query.perPage,
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      data: rows.map(toArticleCard),
      meta: buildPagination(query.page, query.perPage, total),
    };
  }

  async findBySlug(slug: string, viewer?: AuthenticatedUser) {
    const article = await this.prisma.article.findFirst({
      where: { slug, deletedAt: null },
      select: { ...ARTICLE_DETAIL_SELECT, status: true },
    });

    if (!article) throw new NotFoundException('Article introuvable.');

    const isPublished = article.status === ArticleStatus.PUBLISHED;
    if (!isPublished && !viewer) throw new NotFoundException('Article introuvable.');

    if (!isPublished && viewer && !STAFF_ROLES.includes(viewer.role)) {
      throw new NotFoundException('Article introuvable.');
    }

    // Un brouillon consulté depuis le back-office n'incrémente pas les vues.
    if (isPublished) void this.registerView(article.id);

    return {
      ...article,
      authors: article.authors.flatMap((entry) => (entry.user.authorProfile ? [entry.user.authorProfile] : [])),
      tags: article.tags.map((entry) => entry.tag),
    };
  }

  async create(dto: CreateArticleDto, user: AuthenticatedUser) {
    const slug = await this.uniqueSlug(dto.title);
    const bodyText = this.htmlToText(dto.bodyHtml);
    const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

    const article = await this.prisma.article.create({
      data: {
        slug,
        title: dto.title.trim(),
        subtitle: dto.subtitle?.trim(),
        excerpt: dto.excerpt.trim(),
        bodyHtml: dto.bodyHtml,
        bodyText,
        wordCount,
        readingMinutes: Math.max(1, Math.round(wordCount / 200)),
        format: dto.format,
        status: ArticleStatus.DRAFT,
        categoryId: dto.categoryId,
        heroImageId: dto.heroImageId,
        isPremium: dto.isPremium ?? false,
        isBreaking: dto.isBreaking ?? false,
        isFeatured: dto.isFeatured ?? false,
        allowComments: dto.allowComments ?? true,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        focusKeyword: dto.focusKeyword,
        canonicalUrl: dto.canonicalUrl,
        ogImageUrl: dto.ogImageUrl,
        authors: dto.authorIds?.length
          ? { create: dto.authorIds.map((userId, index) => ({ userId, isLead: index === 0 })) }
          : user
            ? { create: [{ userId: await this.authorIdFor(user), isLead: true }] }
            : undefined,
        tags: dto.tagSlugs?.length
          ? {
              create: await Promise.all(
                dto.tagSlugs.map(async (tagSlug) => ({
                  tagId: await this.ensureTag(tagSlug),
                })),
              ),
            }
          : undefined,
        revisions: {
          create: {
            authorId: user.id,
            action: RevisionAction.CREATED,
            title: dto.title.trim(),
            excerpt: dto.excerpt.trim(),
            bodyHtml: dto.bodyHtml,
            status: ArticleStatus.DRAFT,
          },
        },
      },
      select: ARTICLE_DETAIL_SELECT,
    });

    await this.redis.delByPrefix(CACHE_PREFIX);
    return article;
  }

  async update(id: string, dto: UpdateArticleDto, user: AuthenticatedUser) {
    const existing = await this.prisma.article.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, title: true, bodyHtml: true, status: true, slug: true },
    });
    if (!existing) throw new NotFoundException('Article introuvable.');

    const data: Prisma.ArticleUpdateInput = {};

    if (dto.title !== undefined) data.title = dto.title.trim();
    if (dto.subtitle !== undefined) data.subtitle = dto.subtitle.trim();
    if (dto.excerpt !== undefined) data.excerpt = dto.excerpt.trim();
    if (dto.format !== undefined) data.format = dto.format;
    if (dto.isPremium !== undefined) data.isPremium = dto.isPremium;
    if (dto.isBreaking !== undefined) data.isBreaking = dto.isBreaking;
    if (dto.isFeatured !== undefined) data.isFeatured = dto.isFeatured;
    if (dto.allowComments !== undefined) data.allowComments = dto.allowComments;
    if (dto.seoTitle !== undefined) data.seoTitle = dto.seoTitle;
    if (dto.seoDescription !== undefined) data.seoDescription = dto.seoDescription;
    if (dto.focusKeyword !== undefined) data.focusKeyword = dto.focusKeyword;
    if (dto.canonicalUrl !== undefined) data.canonicalUrl = dto.canonicalUrl;
    if (dto.ogImageUrl !== undefined) data.ogImageUrl = dto.ogImageUrl;
    if (dto.scheduledAt !== undefined) data.scheduledAt = new Date(dto.scheduledAt);
    if (dto.categoryId !== undefined) data.category = { connect: { id: dto.categoryId } };
    if (dto.heroImageId !== undefined) data.heroImage = { connect: { id: dto.heroImageId } };

    if (dto.bodyHtml !== undefined) {
      const bodyText = this.htmlToText(dto.bodyHtml);
      const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
      data.bodyHtml = dto.bodyHtml;
      data.bodyText = bodyText;
      data.wordCount = wordCount;
      data.readingMinutes = Math.max(1, Math.round(wordCount / 200));
    }

    if (dto.tagSlugs !== undefined) {
      const tagIds = await Promise.all(dto.tagSlugs.map((slug) => this.ensureTag(slug)));
      data.tags = { deleteMany: {}, create: tagIds.map((tagId) => ({ tagId })) };
    }

    if (dto.authorIds !== undefined) {
      data.authors = {
        deleteMany: {},
        create: dto.authorIds.map((userId, index) => ({ userId, isLead: index === 0 })),
      };
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const article = await tx.article.update({
        where: { id },
        data,
        select: ARTICLE_DETAIL_SELECT,
      });

      await tx.articleRevision.create({
        data: {
          articleId: id,
          authorId: user.id,
          action: RevisionAction.UPDATED,
          title: article.title,
          excerpt: article.excerpt,
          bodyHtml: article.bodyHtml,
          status: article.status,
        },
      });

      return article;
    });

    await this.redis.delByPrefix(CACHE_PREFIX);
    return updated;
  }

  /**
   * Transition de statut.
   *
   * La publication n'est autorisée qu'aux rôles éditoriaux habilités et
   * horodate l'article ; c'est ce champ `publishedAt` qui pilote le fil public.
   */
  async moderate(id: string, dto: ModerateArticleDto, user: AuthenticatedUser) {
    const article = await this.prisma.article.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, status: true, title: true },
    });
    if (!article) throw new NotFoundException('Article introuvable.');

    const data: Prisma.ArticleUpdateInput = {
      status: dto.status,
      reviewedBy: { connect: { id: user.id } },
    };

    if (dto.status === ArticleStatus.PUBLISHED) {
      data.publishedAt = new Date();
      data.scheduledAt = null;
    }
    if (dto.status === ArticleStatus.SCHEDULED) {
      if (!dto.scheduledAt) throw new BadRequestException('Une date de programmation est requise.');
      data.scheduledAt = new Date(dto.scheduledAt);
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.article.update({
        where: { id },
        data,
        select: ARTICLE_DETAIL_SELECT,
      });

      await tx.articleRevision.create({
        data: {
          articleId: id,
          authorId: user.id,
          action:
            dto.status === ArticleStatus.PUBLISHED
              ? RevisionAction.PUBLISHED
              : dto.status === ArticleStatus.SCHEDULED
                ? RevisionAction.SCHEDULED
                : dto.status === ArticleStatus.APPROVED
                  ? RevisionAction.APPROVED
                  : dto.status === ArticleStatus.REJECTED
                    ? RevisionAction.REJECTED
                    : dto.status === ArticleStatus.ARCHIVED
                      ? RevisionAction.ARCHIVED
                      : RevisionAction.UPDATED,
          title: result.title,
          excerpt: result.excerpt,
          bodyHtml: result.bodyHtml,
          status: result.status,
          comment: dto.note,
          diff: { from: article.status, to: dto.status },
        },
      });

      return result;
    });

    await this.redis.delByPrefix(CACHE_PREFIX);
    return updated;
  }

  /** Suppression logique : les URL indexées continuent de répondre 410 côté web. */
  async softDelete(id: string, user: AuthenticatedUser) {
    const article = await this.prisma.article.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, title: true, excerpt: true, bodyHtml: true },
    });
    if (!article) throw new NotFoundException('Article introuvable.');

    await this.prisma.article.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: ArticleStatus.ARCHIVED,
        revisions: {
          create: {
            authorId: user.id,
            action: RevisionAction.DELETED,
            title: article.title,
            excerpt: article.excerpt,
            bodyHtml: article.bodyHtml,
            status: ArticleStatus.ARCHIVED,
          },
        },
      },
    });

    await this.redis.delByPrefix(CACHE_PREFIX);
  }

  async revisions(id: string) {
    return this.prisma.articleRevision.findMany({
      where: { articleId: id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        action: true,
        comment: true,
        version: true,
        createdAt: true,
        author: { select: { id: true, displayName: true } },
      },
    });
  }

  /** Sujets associés : mêmes tags, catégorie identique, hors article courant. */
  async related(slug: string, limit = 4) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      select: { id: true, categoryId: true, tags: { select: { tagId: true } } },
    });
    if (!article) throw new NotFoundException('Article introuvable.');

    const tagIds = article.tags.map((entry) => entry.tagId);
    const or: Prisma.ArticleWhereInput[] = [];
    if (tagIds.length > 0) or.push({ tags: { some: { tagId: { in: tagIds } } } });
    if (article.categoryId) or.push({ categoryId: article.categoryId });

    const rows = await this.prisma.article.findMany({
      where: {
        id: { not: article.id },
        status: ArticleStatus.PUBLISHED,
        deletedAt: null,
        publishedAt: { lte: new Date() },
        ...(or.length > 0 ? { OR: or } : {}),
      },
      select: ARTICLE_CARD_SELECT,
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });

    return rows.map(toArticleCard);
  }

  /** Articles en une : sert au hero et au bloc « À la une ». */
  async featured(limit = 6) {
    const rows = await this.prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        deletedAt: null,
        isFeatured: true,
        publishedAt: { lte: new Date() },
      },
      select: ARTICLE_CARD_SELECT,
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
    return rows.map(toArticleCard);
  }

  async breaking(limit = 8) {
    const rows = await this.prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        deletedAt: null,
        isBreaking: true,
        publishedAt: { lte: new Date() },
      },
      select: ARTICLE_CARD_SELECT,
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
    return rows.map(toArticleCard);
  }

  async popular(days = 7, limit = 5) {
    const since = new Date(Date.now() - days * 86_400_000);
    const rows = await this.prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        deletedAt: null,
        publishedAt: { gte: since },
      },
      select: ARTICLE_CARD_SELECT,
      orderBy: { viewCount: 'desc' },
      take: limit,
    });
    return rows.map(toArticleCard);
  }

  /**
   * Incrémentation des vues sans bloquer la réponse HTTP.
   * Le compteur est best-effort : une vue perdue vaut mieux qu'une latence.
   */
  private async registerView(articleId: string): Promise<void> {
    try {
      await this.prisma.article.update({
        where: { id: articleId },
        data: { viewCount: { increment: 1 } },
      });
    } catch {
      // Ignoré volontairement.
    }
  }

  private buildFilters(query: ListArticlesQueryDto): Prisma.ArticleWhereInput {
    const filters: Prisma.ArticleWhereInput = {};

    if (query.category) {
      filters.category = { slug: query.category, ...(query.subcategory ? {} : {}) };
    }
    if (query.subcategory) {
      filters.category = { slug: query.subcategory };
    }
    if (query.tag) filters.tags = { some: { tag: { slug: query.tag } } };
    if (query.author) filters.authors = { some: { user: { authorProfile: { slug: query.author } } } };
    if (query.format) filters.format = query.format;
    if (query.premium !== undefined) filters.isPremium = query.premium;
    if (query.featured !== undefined) filters.isFeatured = query.featured;

    if (query.from || query.to) {
      filters.publishedAt = {
        ...(query.from ? { gte: new Date(query.from) } : {}),
        ...(query.to ? { lte: new Date(query.to) } : {}),
      };
    }

    if (query.search) {
      filters.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
        { bodyText: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return filters;
  }

  private async uniqueSlug(title: string): Promise<string> {
    const base = slugify(title, { lower: true, strict: true, locale: 'fr' }).slice(0, 90) || 'article';
    let candidate = base;
    let suffix = 1;

    while (await this.prisma.article.findUnique({ where: { slug: candidate }, select: { id: true } })) {
      candidate = `${base}-${++suffix}`;
    }

    return candidate;
  }

  private async ensureTag(slug: string): Promise<string> {
    const normalized = slugify(slug, { lower: true, strict: true, locale: 'fr' });
    const tag = await this.prisma.tag.upsert({
      where: { slug: normalized },
      update: { usageCount: { increment: 1 } },
      create: { slug: normalized, name: slug.trim() },
      select: { id: true },
    });
    return tag.id;
  }

  /**
   * Garantit qu'un profil public existe pour l'auteur, puis renvoie l'identifiant
   * utilisateur attendu par la table de liaison `article_authors`.
   */
  private async authorIdFor(user: AuthenticatedUser): Promise<string> {
    const slug = slugify(user.displayName, { lower: true, strict: true, locale: 'fr' });
    await this.prisma.authorProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, slug, displayName: user.displayName },
      select: { id: true },
    });
    return user.id;
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();
  }

}
