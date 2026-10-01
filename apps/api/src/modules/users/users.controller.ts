import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsIn, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { CurrentUser, type AuthenticatedUser } from '../../common/decorators/auth.decorators';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { UsersService } from './users.service';

class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  image?: string;

  @IsOptional()
  @IsString()
  @MaxLength(600)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  jobTitle?: string;
}

class UpdatePreferencesDto {
  @IsOptional()
  @IsBoolean()
  darkMode?: boolean;

  @IsOptional()
  @IsBoolean()
  breakingNewsAlerts?: boolean;

  @IsOptional()
  @IsBoolean()
  newArticleAlerts?: boolean;

  @IsOptional()
  @IsBoolean()
  weeklyDigest?: boolean;

  @IsOptional()
  @IsBoolean()
  newsletterOptIn?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredCategories?: string[];

  @IsOptional()
  @IsIn(['fr', 'en', 'wo'])
  preferredLanguage?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.8)
  @Max(1.6)
  fontScale?: number;

  @IsOptional()
  @IsBoolean()
  reducedMotion?: boolean;
}

class RecordReadingDto {
  @IsString()
  articleId!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  progress?: number;
}

class MarkReadDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ids?: string[];
}

@ApiTags('Utilisateurs')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Profil de l’utilisateur connecté' })
  profile(@CurrentUser() user: AuthenticatedUser) {
    return this.users.profile(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Mettre à jour le profil' })
  updateProfile(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(user.id, dto);
  }

  @Patch('me/preferences')
  @ApiOperation({ summary: 'Mettre à jour les préférences de lecture' })
  updatePreferences(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdatePreferencesDto) {
    return this.users.updatePreferences(user.id, dto);
  }

  @Get('me/history')
  @ApiOperation({ summary: 'Historique de lecture' })
  history(@CurrentUser() user: AuthenticatedUser, @Query() query: PaginationQueryDto) {
    return this.users.readingHistory(user.id, query);
  }

  @Post('me/history')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enregistrer une lecture' })
  recordReading(@CurrentUser() user: AuthenticatedUser, @Body() dto: RecordReadingDto) {
    return this.users.recordReading(user.id, dto.articleId, dto.progress ?? 0);
  }

  @Get('me/bookmarks')
  @ApiOperation({ summary: 'Articles sauvegardés' })
  bookmarks(@CurrentUser() user: AuthenticatedUser, @Query() query: PaginationQueryDto) {
    return this.users.bookmarks(user.id, query);
  }

  @Post('me/bookmarks/:articleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ajouter ou retirer un article des favoris' })
  toggleBookmark(@CurrentUser() user: AuthenticatedUser, @Body('articleId') articleId: string) {
    return this.users.toggleBookmark(user.id, articleId);
  }

  @Get('me/notifications')
  @ApiOperation({ summary: 'Notifications' })
  notifications(@CurrentUser() user: AuthenticatedUser, @Query() query: PaginationQueryDto) {
    return this.users.notifications(user.id, query);
  }

  @Post('me/notifications/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marquer des notifications comme lues' })
  markRead(@CurrentUser() user: AuthenticatedUser, @Body() dto: MarkReadDto) {
    return this.users.markNotificationsRead(user.id, dto.ids);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Supprimer mon compte (anonymisation RGPD)' })
  deleteAccount(@CurrentUser() user: AuthenticatedUser) {
    return this.users.deleteAccount(user.id);
  }
}
