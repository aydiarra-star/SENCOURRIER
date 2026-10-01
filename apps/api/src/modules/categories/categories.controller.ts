import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/auth.decorators';
import { CategoriesService } from './categories.service';

@ApiTags('Rubriques')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Arborescence des rubriques' })
  tree() {
    return this.categories.tree();
  }

  @Public()
  @Get('menu')
  @ApiOperation({ summary: 'Entrées du menu principal' })
  menu() {
    return this.categories.menu();
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Détail d’une rubrique' })
  bySlug(@Param('slug') slug: string) {
    return this.categories.findBySlug(slug);
  }
}
