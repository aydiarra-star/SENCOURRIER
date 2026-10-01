import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/auth.decorators';
import { TagsService } from './tags.service';

@ApiTags('Mots-clés')
@Controller('tags')
export class TagsController {
  constructor(private readonly tags: TagsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Nuage de mots-clés' })
  cloud(@Query('limit') limit?: string) {
    return this.tags.cloud(Number(limit) || 40);
  }

  @Public()
  @Get('trending')
  @ApiOperation({ summary: 'Sujets tendance' })
  trending(@Query('limit') limit?: string) {
    return this.tags.trending(Number(limit) || 10);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Détail d’un mot-clé' })
  bySlug(@Param('slug') slug: string) {
    return this.tags.findBySlug(slug);
  }
}
