import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Public } from '../../common/decorators/auth.decorators';
import { SearchService } from './search.service';

export class SearchQueryDto {
  @IsString()
  @MaxLength(120)
  q!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  perPage: number = 20;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsIn(['article', 'author', 'tag', 'category'])
  type?: 'article' | 'author' | 'tag' | 'category';
}

@ApiTags('Recherche')
@Controller('search')
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Public()
  @Get()
  @Throttle({ default: { limit: 120, ttl: 60_000 } })
  @ApiOperation({ summary: 'Recherche plein texte' })
  query(@Query() dto: SearchQueryDto) {
    return this.search.search(dto);
  }

  @Public()
  @Get('suggest')
  @Throttle({ default: { limit: 300, ttl: 60_000 } })
  @ApiOperation({ summary: 'Suggestions instantanées' })
  suggest(@Query('q') q = '', @Query('limit') limit?: string) {
    return this.search.suggest(q, Number(limit) || 8);
  }

  @Public()
  @Get('popular')
  @ApiOperation({ summary: 'Recherches les plus fréquentes' })
  popular(@Query('limit') limit?: string) {
    return this.search.popularSearches(Number(limit) || 8);
  }
}
