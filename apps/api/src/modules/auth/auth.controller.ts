import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { CurrentUser, Public, type AuthenticatedRequest, type AuthenticatedUser } from '../../common/decorators/auth.decorators';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { AuthService } from './auth.service';
import {
  DisableTwoFactorDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  VerifyTwoFactorDto,
} from './dto/auth.dto';
import type { GoogleProfile } from './strategies/google.strategy';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Public()
  @Post('register')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({ summary: 'Créer un compte lecteur' })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.auth.register(dto);
    this.attachAuthCookies(res, result.refreshToken);
    return result;
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({ summary: 'Se connecter avec e-mail et mot de passe' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.auth.login(dto);
    if (!result.requiresTwoFactor) this.attachAuthCookies(res, result.refreshToken);
    return result;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renouveler la session (rotation du jeton)' })
  async refresh(@Body() dto: RefreshTokenDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.auth.refresh(dto.refreshToken);
    this.attachAuthCookies(res, tokens.refreshToken);
    return tokens;
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Fermer la session courante' })
  async logout(@Body() dto: RefreshTokenDto, @Res({ passthrough: true }) res: Response) {
    await this.auth.logout(dto.refreshToken);
    this.clearAuthCookies(res);
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Fermer toutes les sessions de l’utilisateur' })
  async logoutAll(@CurrentUser() user: AuthenticatedUser, @Res({ passthrough: true }) res: Response) {
    await this.auth.logoutAllSessions(user.id);
    this.clearAuthCookies(res);
  }

  @Get('me')
  @ApiOperation({ summary: 'Profil de la session courante' })
  me(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Démarrer la connexion Google OAuth' })
  googleAuth() {
    // Redirection gérée par Passport.
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Retour de Google OAuth' })
  async googleCallback(
    @Req() req: AuthenticatedRequest & { user?: unknown },
    @Res() res: Response,
  ) {
    const profile = req.user as GoogleProfile | undefined;
    if (!profile) throw new UnauthorizedException('Profil Google indisponible.');
    const result = await this.auth.loginWithGoogle(profile);
    this.attachAuthCookies(res, result.refreshToken);
    const target = new URL('/tableau-de-bord', this.config.get<string>('APP_URL', 'http://localhost:3000'));
    res.redirect(target.toString());
  }

  @Post('2fa/setup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Générer un secret TOTP (2FA)' })
  setupTwoFactor(@CurrentUser() user: AuthenticatedUser) {
    return this.auth.setupTwoFactor(user.id);
  }

  @Post('2fa/enable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activer la 2FA après vérification du code' })
  enableTwoFactor(@CurrentUser() user: AuthenticatedUser, @Body() dto: VerifyTwoFactorDto) {
    return this.auth.enableTwoFactor(user.id, dto.code);
  }

  @Post('2fa/disable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Désactiver la 2FA' })
  disableTwoFactor(@CurrentUser() user: AuthenticatedUser, @Body() dto: DisableTwoFactorDto) {
    return this.auth.disableTwoFactor(user.id, dto.password, dto.code);
  }

  /**
   * Le refresh token vit dans un cookie httpOnly ; l'access token est renvoyé
   * dans le corps pour les clients mobiles qui n'ont pas de gestionnaire de
   * cookies (React Native).
   */
  private attachAuthCookies(res: Response, refreshToken: string): void {
    const secure = this.config.get<string>('NODE_ENV') === 'production';
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/api/auth',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  private clearAuthCookies(res: Response): void {
    res.clearCookie('refresh_token', { path: '/api/auth' });
    res.clearCookie('access_token', { path: '/' });
  }
}
