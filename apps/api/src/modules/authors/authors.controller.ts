import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/auth.decorators';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { AuthorsService } from './authors.service';

@ApiTags('Journalistes')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authors: AuthorsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste des journalistes' })
  list(@Query() query: PaginationQueryDto) {
    return this.authors.list(query);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Journalistes mis en avant' })
  featured(@Query('limit') limit?: string) {
    return this.authors.featured(Number(limit) || 8);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Profil public d’un journaliste et ses articles' })
  bySlug(@Param('slug') slug: string) {
    return this.authors.findBySlug(slug);
  }
}
