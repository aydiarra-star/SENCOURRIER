import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@sencourrier/types';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { CurrentUser, Roles, type AuthenticatedUser } from '../../common/decorators/auth.decorators';
import { MediaService } from './media.service';

class UpdateMediaDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  altText?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  credit?: string;
}

@ApiTags('Médias')
@ApiBearerAuth()
@Controller('media')
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Post('upload')
  @Roles(Role.JOURNALIST)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 12 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiOperation({ summary: 'Téléverser une image (optimisation WebP + miniature + blur)' })
  upload(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: AuthenticatedUser) {
    if (!file) throw new BadRequestException('Aucun fichier reçu.');
    return this.media.uploadImage(file.buffer, file.originalname, user.id);
  }

  @Get()
  @Roles(Role.JOURNALIST)
  @ApiOperation({ summary: 'Médiathèque' })
  list(@Query('page') page?: string, @Query('perPage') perPage?: string) {
    return this.media.list(Number(page) || 1, Number(perPage) || 24);
  }

  @Patch(':id')
  @Roles(Role.JOURNALIST)
  @ApiOperation({ summary: 'Mettre à jour les métadonnées éditoriales d’un média' })
  update(@Param('id') id: string, @Body() dto: UpdateMediaDto) {
    return this.media.updateMetadata(id, dto);
  }

  @Delete(':id')
  @Roles(Role.EDITOR_IN_CHIEF)
  @ApiOperation({ summary: 'Retirer un média de la médiathèque' })
  async remove(@Param('id') id: string) {
    await this.media.remove(id);
    await this.media.invalidate(id);
    return { deleted: true };
  }
}
