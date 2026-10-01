import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Role } from '@sencourrier/types';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Public, Roles } from '../../common/decorators/auth.decorators';
import { AnalyticsService } from './analytics.service';

class TrackPageViewDto {
  @IsString()
  @MaxLength(64)
  sessionId!: string;

  @IsString()
  @MaxLength(500)
  path!: string;

  @IsOptional()
  @IsString()
  articleId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  referrer?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  source?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  medium?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  campaign?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  deviceType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  browser?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  os?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  language?: string;
}

@ApiTags('Analytique')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Public()
  @Post('pageview')
  @HttpCode(HttpStatus.ACCEPTED)
  @Throttle({ default: { limit: 300, ttl: 60_000 } })
  @ApiOperation({ summary: 'Enregistrer une vue de page (best-effort)' })
  async track(@Body() dto: TrackPageViewDto) {
    await this.analytics.trackPageView(dto);
    return { recorded: true };
  }

  @ApiBearerAuth()
  @Get('overview')
  @Roles(Role.EDITOR_IN_CHIEF)
  @ApiOperation({ summary: 'Tableau de bord : trafic, revenus, audiences' })
  overview(@Query('days') days?: string) {
    return this.analytics.overview(Number(days) || 30);
  }

  @ApiBearerAuth()
  @Get('timeseries')
  @Roles(Role.EDITOR_IN_CHIEF)
  @ApiOperation({ summary: 'Série temporelle d’une métrique' })
  timeseries(
    @Query('metric') metric: 'visitors' | 'pageViews' | 'revenueXof' | 'adRevenueXof' = 'visitors',
    @Query('days') days?: string,
  ) {
    return this.analytics.timeseries(metric, Number(days) || 90);
  }

  @ApiBearerAuth()
  @Post('rollup')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Consolider les métriques quotidiennes' })
  rollup(@Query('date') date?: string) {
    return this.analytics.rollupDaily(date ? new Date(date) : undefined);
  }
}

export const ANALYTICS_METRICS = ['visitors', 'pageViews', 'revenueXof', 'adRevenueXof'] as const;
export type AnalyticsMetric = (typeof ANALYTICS_METRICS)[number];
