import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Role } from '@sencourrier/types';
import { ArrayMaxSize, IsArray, IsEmail, IsOptional, IsString } from 'class-validator';
import { Public, Roles } from '../../common/decorators/auth.decorators';
import { NewsletterService } from './newsletter.service';

class SubscribeDto {
  @IsEmail({}, { message: 'Adresse e-mail invalide.' })
  email!: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  interests?: string[];

  @IsOptional()
  @IsString()
  source?: string;
}

@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletter: NewsletterService) {}

  @Public()
  @Post('subscribe')
  @HttpCode(HttpStatus.ACCEPTED)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Inscrire une adresse (double opt-in)' })
  subscribe(@Body() dto: SubscribeDto) {
    return this.newsletter.subscribe(dto.email, dto.interests ?? [], dto.source ?? 'site');
  }

  @Public()
  @Get('confirm')
  @ApiOperation({ summary: 'Confirmer une inscription' })
  confirm(@Query('token') token: string) {
    return this.newsletter.confirm(token);
  }

  @Public()
  @Get('unsubscribe')
  @ApiOperation({ summary: 'Se désinscrire' })
  unsubscribe(@Query('token') token: string) {
    return this.newsletter.unsubscribe(token);
  }

  @Roles(Role.EDITOR_IN_CHIEF)
  @Get('stats')
  @ApiOperation({ summary: 'Statistiques d’abonnement à la newsletter' })
  stats() {
    return this.newsletter.stats();
  }
}
