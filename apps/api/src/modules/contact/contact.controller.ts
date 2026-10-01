import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Role } from '@sencourrier/types';
import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Public, Roles } from '../../common/decorators/auth.decorators';
import { ContactService } from './contact.service';

class ContactDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @IsEmail({}, { message: 'Adresse e-mail invalide.' })
  email!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(160)
  subject!: string;

  @IsString()
  @MinLength(20, { message: 'Le message doit contenir au moins 20 caractères.' })
  @MaxLength(5000)
  message!: string;

  @IsOptional()
  @IsIn(['general', 'redaction', 'publicite', 'abonnement', 'signalement', 'partenariat'])
  topic?: string;
}

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contact: ContactService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Envoyer un message à la rédaction' })
  submit(@Body() dto: ContactDto) {
    return this.contact.submit(dto);
  }

  @Roles(Role.EDITOR_IN_CHIEF)
  @Get()
  @ApiOperation({ summary: 'Consulter les messages reçus' })
  list(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
    @Query('status') status?: string,
  ) {
    return this.contact.list(Number(page) || 1, Number(perPage) || 20, status);
  }
}
