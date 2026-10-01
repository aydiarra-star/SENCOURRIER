import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaClient } from '@sencourrier/database';
import type { Role } from '@sencourrier/types';
import { PRISMA } from '../../../infra/prisma/prisma.module';
import type { AuthenticatedUser } from '../../../common/decorators/auth.decorators';

interface AccessTokenPayload {
  sub: string;
  email: string;
  role: Role;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    @Inject(PRISMA) private readonly prisma: PrismaClient,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // Le web SSR et la PWA utilisent un cookie httpOnly plutôt que le
        // stockage local, moins exposé aux scripts tiers.
        (request: { cookies?: Record<string, string> }) => request?.cookies?.access_token ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      issuer: config.get<string>('JWT_ISSUER'),
      audience: config.get<string>('JWT_AUDIENCE'),
    });
  }

  /**
   * Le jeton ne suffit pas : le compte doit toujours exister et être actif.
   * Une révocation ou un bannissement prend donc effet immédiatement, sans
   * attendre l'expiration du jeton.
   */
  async validate(payload: AccessTokenPayload): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findFirst({
      where: { id: payload.sub, isActive: true, isBanned: false, deletedAt: null },
      select: { id: true, email: true, role: true, displayName: true },
    });

    if (!user) throw new UnauthorizedException('Compte introuvable ou désactivé.');

    return {
      id: user.id,
      email: user.email,
      role: user.role as Role,
      displayName: user.displayName,
    };
  }
}
