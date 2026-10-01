import { ArticleFormat, ArticleStatus } from '@sencourrier/types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination.dto';

export class ListArticlesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  subcategory?: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @IsOptional()
  @IsEnum(ArticleFormat)
  format?: ArticleFormat;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  premium?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsISO8601()
  from?: string;

  @IsOptional()
  @IsISO8601()
  to?: string;
}

export class CreateArticleDto {
  @IsString()
  @MinLength(8, { message: 'Le titre doit contenir au moins 8 caractères.' })
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(280)
  subtitle?: string;

  @IsString()
  @MinLength(30, { message: 'Le chapô doit contenir au moins 30 caractères.' })
  @MaxLength(600)
  excerpt!: string;

  @IsString()
  @MinLength(1)
  bodyHtml!: string;

  @IsOptional()
  @IsEnum(ArticleFormat)
  format?: ArticleFormat;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagSlugs?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  authorIds?: string[];

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPremium?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isBreaking?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  heroImageId?: string;

  @IsOptional()
  @IsISO8601()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(320)
  seoDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  focusKeyword?: string;

  @IsOptional()
  @IsString()
  canonicalUrl?: string;

  @IsOptional()
  @IsString()
  ogImageUrl?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  allowComments?: boolean;
}

export class UpdateArticleDto extends CreateArticleDto {
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(200)
  declare title: string;

  @IsOptional()
  @IsString()
  @MinLength(30)
  @MaxLength(600)
  declare excerpt: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  declare bodyHtml: string;
}

export class ModerateArticleDto {
  @IsEnum(ArticleStatus)
  status!: ArticleStatus;

  @IsOptional()
  @IsISO8601()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}
