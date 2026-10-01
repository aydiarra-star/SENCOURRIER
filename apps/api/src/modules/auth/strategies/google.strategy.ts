import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, type VerifyCallback } from 'passport-google-oauth20';

export interface GoogleProfile {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  emailVerified: boolean;
}

/**
 * Connexion Google.
 *
 * La stratégie est enregistrée même sans identifiants configurés : la route
 * renvoie alors une erreur explicite plutôt que de faire échouer le démarrage
 * en développement local.
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  readonly enabled: boolean;

  constructor(config: ConfigService) {
    const clientID = config.get<string>('GOOGLE_CLIENT_ID') ?? '';
    const clientSecret = config.get<string>('GOOGLE_CLIENT_SECRET') ?? '';

    super({
      clientID: clientID || 'google-oauth-non-configure',
      clientSecret: clientSecret || 'google-oauth-non-configure',
      callbackURL: `${config.get<string>('API_PUBLIC_URL', 'http://localhost:3001')}/api/auth/google/callback`,
      scope: ['email', 'profile'],
    });

    this.enabled = Boolean(clientID && clientSecret);
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): void {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      done(new Error('Le compte Google ne fournit aucune adresse e-mail vérifiée.'), undefined);
      return;
    }

    const result: GoogleProfile = {
      googleId: profile.id,
      email,
      name: profile.displayName || email.split('@')[0]!,
      picture: profile.photos?.[0]?.value,
      emailVerified: profile.emails?.[0]?.verified ?? false,
    };

    done(null, result);
  }
}
