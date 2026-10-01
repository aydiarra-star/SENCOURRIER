import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import { PrismaClient } from '@sencourrier/database';
import { Role, STAFF_ROLES } from '@sencourrier/types';
import { createHash, randomBytes } from 'node:crypto';
import { PRISMA } from '../../infra/prisma/prisma.module';
import type { GoogleProfile } from './strategies/google.strategy';
import type { LoginDto, RegisterDto } from './dto/auth.dto';

const BCRYPT_ROUNDS = 12;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResult extends AuthTokens {
  user: {
    id: string;
    email: string;
    displayName: string;
    role: Role;
    image: string | null;
  };
  requiresTwoFactor?: boolean;
}

interface TokenSubject {
  sub: string;
  email: string;
  role: Role;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const email = dto.email.toLowerCase().trim();

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Un compte existe déjà avec cette adresse e-mail.');

    const user = await this.prisma.user.create({
      data: {
        email,
        displayName: dto.displayName.trim(),
        name: dto.displayName.trim(),
        passwordHash: await bcrypt.hash(dto.password, BCRYPT_ROUNDS),
        role: Role.READER,
        preferences: { create: {} },
      },
      select: { id: true, email: true, displayName: true, role: true, image: true },
    });

    const tokens = await this.issueTokens({
      sub: user.id,
      email: user.email,
      role: user.role as Role,
    });

    return { user: { ...user, role: user.role as Role }, ...tokens };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
      include: { twoFactorSecret: true },
    });

    // Message identique pour un compte inexistant et un mot de passe erroné :
    // ne pas révéler quelles adresses sont enregistrées.
    const invalid = new UnauthorizedException('Identifiants incorrects.');
    if (!user?.passwordHash) throw invalid;
    if (user.isBanned) throw new UnauthorizedException('Ce compte est suspendu.');
    if (!user.isActive) throw new UnauthorizedException('Ce compte est désactivé.');

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) throw invalid;

    if (user.twoFactorSecret?.confirmedAt) {
      if (!dto.totp) return { requiresTwoFactor: true } as AuthResult;
      const valid = authenticator.verify({ token: dto.totp, secret: user.twoFactorSecret.secret });
      if (!valid) throw new UnauthorizedException('Code de vérification invalide.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.issueTokens({
      sub: user.id,
      email: user.email,
      role: user.role as Role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role as Role,
        image: user.image,
      },
      ...tokens,
    };
  }

  /**
   * Connexion Google.
   *
   * Le premier compte Google enregistré ne devient jamais administrateur : les
   * rôles éditoriaux s'attribuent depuis le back-office, pas par auto-service.
   */
  async loginWithGoogle(profile: GoogleProfile): Promise<AuthResult> {
    const email = profile.email.toLowerCase();

    let user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
      select: { id: true, email: true, displayName: true, role: true, image: true, isBanned: true },
    });

    if (!user) {
      const created = await this.prisma.user.create({
        data: {
          email,
          displayName: profile.name,
          name: profile.name,
          image: profile.picture,
          emailVerified: profile.emailVerified ? new Date() : null,
          role: Role.READER,
          preferences: { create: {} },
        },
        select: {
          id: true,
          email: true,
          displayName: true,
          role: true,
          image: true,
          isBanned: true,
        },
      });
      user = created;
    }

    if (user.isBanned) throw new UnauthorizedException('Ce compte est suspendu.');

    await this.prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: 'google',
          providerAccountId: profile.googleId,
        },
      },
      update: { userId: user.id },
      create: {
        userId: user.id,
        type: 'oauth',
        provider: 'google',
        providerAccountId: profile.googleId,
      },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.issueTokens({
      sub: user.id,
      email: user.email,
      role: user.role as Role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role as Role,
        image: user.image,
      },
      ...tokens,
    };
  }

  /**
   * Rotation du refresh token.
   *
   * Chaque usage consomme le jeton présenté et en émet un nouveau : un jeton
   * volé ne peut donc pas être rejoué indéfiniment.
   */
  async refresh(refreshToken: string): Promise<AuthTokens> {
    const tokenHash = this.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: { select: { id: true, email: true, role: true, isActive: true, isBanned: true } },
      },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expirée, veuillez vous reconnecter.');
    }

    if (!stored.user.isActive || stored.user.isBanned) {
      throw new UnauthorizedException('Ce compte n’est plus autorisé.');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens({
      sub: stored.user.id,
      email: stored.user.email,
      role: stored.user.role as Role,
    });
  }

  async logout(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: this.hashToken(refreshToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async logoutAllSessions(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  /** Prépare la 2FA : le secret n'est actif qu'après confirmation par un code. */
  async setupTwoFactor(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (!user) throw new NotFoundException('Compte introuvable.');

    const secret = authenticator.generateSecret();
    const issuer = this.config.get<string>('TWO_FACTOR_ISSUER', 'SENCOURRIER');
    const otpauthUrl = authenticator.keyuri(user.email, issuer, secret);

    await this.prisma.twoFactorSecret.upsert({
      where: { userId },
      update: { secret, confirmedAt: null },
      create: { userId, secret },
    });

    return { secret, otpauthUrl };
  }

  async enableTwoFactor(userId: string, code: string): Promise<{ enabled: true }> {
    const record = await this.prisma.twoFactorSecret.findUnique({ where: { userId } });
    if (!record) throw new NotFoundException('Aucune configuration 2FA en attente.');

    if (!authenticator.verify({ token: code, secret: record.secret })) {
      throw new UnauthorizedException('Code de vérification invalide.');
    }

    await this.prisma.twoFactorSecret.update({
      where: { userId },
      data: { confirmedAt: new Date() },
    });

    return { enabled: true };
  }

  async disableTwoFactor(
    userId: string,
    password: string,
    code: string,
  ): Promise<{ enabled: false }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { twoFactorSecret: true },
    });

    if (!user?.passwordHash) throw new NotFoundException('Compte introuvable.');
    if (!(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Mot de passe incorrect.');
    }
    if (!user.twoFactorSecret) throw new NotFoundException('La 2FA n’est pas activée.');
    if (!authenticator.verify({ token: code, secret: user.twoFactorSecret.secret })) {
      throw new UnauthorizedException('Code de vérification invalide.');
    }

    await this.prisma.twoFactorSecret.delete({ where: { userId } });
    return { enabled: false };
  }

  /** Élévation de rôle réservée au back-office (promotion d'un membre). */
  async assignRole(userId: string, role: Role): Promise<void> {
    if (!STAFF_ROLES.includes(role) && role !== Role.PREMIUM_SUBSCRIBER && role !== Role.READER) {
      throw new UnauthorizedException('Rôle non attribuable.');
    }
    await this.prisma.user.update({ where: { id: userId }, data: { role } });
    this.logger.log(`Rôle ${role} attribué à l'utilisateur ${userId}`);
  }

  private async issueTokens(subject: TokenSubject): Promise<AuthTokens> {
    const accessTtl = this.config.get<string>('JWT_ACCESS_TTL', '15m');
    const refreshTtl = this.config.get<string>('JWT_REFRESH_TTL', '30d');

    const accessToken = await this.jwt.signAsync(subject, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: accessTtl as `${number}${'s' | 'm' | 'h' | 'd'}`,
      issuer: this.config.get<string>('JWT_ISSUER'),
      audience: this.config.get<string>('JWT_AUDIENCE'),
    });

    const refreshToken = randomBytes(48).toString('base64url');

    await this.prisma.refreshToken.create({
      data: {
        userId: subject.sub,
        tokenHash: this.hashToken(refreshToken),
        expiresAt: new Date(Date.now() + this.parseDuration(refreshTtl)),
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: Math.floor(this.parseDuration(accessTtl) / 1000),
    };
  }

  /** Les jetons sont stockés hachés : une fuite de la table ne suffit pas à les rejouer. */
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private parseDuration(value: string): number {
    const match = /^(\d+)\s*([smhd])$/.exec(value.trim());
    if (!match) return 15 * 60 * 1000;

    const amount = Number(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
    return amount * (multipliers[unit ?? 'm'] ?? 60_000);
  }
}
