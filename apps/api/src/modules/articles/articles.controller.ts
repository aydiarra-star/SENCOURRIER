import { ArticleFormat, ArticleStatus, Role } from '@sencourrier/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser, Public, Roles, type AuthenticatedUser } from '../../common/decorators/auth.decorators';
import { ArticlesService } from './articles.service';
import {
  CreateArticleDto,
  ListArticlesQueryDto,
  ModerateArticleDto,
  UpdateArticleDto,
} from './dto/article.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articles: ArticlesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Fil public des articles publiés' })
  list(@Query() query: ListArticlesQueryDto) {
    return this.articles.listPublic(query);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Articles à la une (hero)' })
  featured(@Query('limit') limit?: string) {
    return this.articles.featured(this.parseLimit(limit, 6));
  }

  @Public()
  @Get('breaking')
  @Throttle({ default: { limit: 240, ttl: 60_000 } })
  @ApiOperation({ summary: 'Dernière minute (bandeau défilant)' })
  breaking(@Query('limit') limit?: string) {
    return this.articles.breaking(this.parseLimit(limit, 8));
  }

  @Public()
  @Get('popular')
  @ApiOperation({ summary: 'Articles les plus lus' })
  popular(@Query('days') days?: string, @Query('limit') limit?: string) {
    return this.articles.popular(Number(days) || 7, this.parseLimit(limit, 5));
  }

  @ApiBearerAuth()
  @Get('admin')
  @Roles(Role.JOURNALIST)
  @ApiOperation({ summary: 'Liste back-office (tous statuts, selon le rôle)' })
  listForStaff(@Query() query: ListArticlesQueryDto, @CurrentUser() user: AuthenticatedUser) {
    return this.articles.listForStaff(query, user);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Détail d’un article par slug' })
  async bySlug(@Param('slug') slug: string, @CurrentUser() user?: AuthenticatedUser) {
    return this.articles.findBySlug(slug, user);
  }

  @Public()
  @Get('slug/:slug/related')
  @ApiOperation({ summary: 'Articles associés' })
  related(@Param('slug') slug: string, @Query('limit') limit?: string) {
    return this.articles.related(slug, this.parseLimit(limit, 4));
  }

  @ApiBearerAuth()
  @Post()
  @Roles(Role.JOURNALIST)
  @ApiOperation({ summary: 'Créer un article (brouillon)' })
  create(@Body() dto: CreateArticleDto, @CurrentUser() user: AuthenticatedUser) {
    return this.articles.create(dto, user);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @Roles(Role.JOURNALIST)
  @ApiOperation({ summary: 'Modifier un article' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateArticleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.articles.update(id, dto, user);
  }

  @ApiBearerAuth()
  @Patch(':id/moderate')
  @Roles(Role.EDITOR_IN_CHIEF)
  @ApiOperation({ summary: 'Valider, refuser, programmer ou publier' })
  moderate(
    @Param('id') id: string,
    @Body() dto: ModerateArticleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.articles.moderate(id, dto, user);
  }

  @ApiBearerAuth()
  @Get(':id/revisions')
  @Roles(Role.JOURNALIST)
  @ApiOperation({ summary: 'Historique des modifications' })
  revisions(@Param('id') id: string) {
    return this.articles.revisions(id);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.EDITOR_IN_CHIEF)
  @ApiOperation({ summary: 'Retirer un article (suppression logique)' })
  async remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    await this.articles.softDelete(id, user);
    return { deleted: true };
  }

  private parseLimit(value: string | undefined, fallback: number): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 1) return fallback;
    return Math.min(Math.floor(parsed), 50);
  }
}

export const ARTICLE_ENUMS = { ArticleStatus, ArticleFormat };
