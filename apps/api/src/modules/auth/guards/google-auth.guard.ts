import { Injectable, ServiceUnavailableException, type ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleStrategy } from '../strategies/google.strategy';

/**
 * Refuse explicitement la connexion Google lorsque les identifiants OAuth ne
 * sont pas configurés, au lieu de laisser Passport échouer avec un message
 * obscur.
 */
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private readonly strategy: GoogleStrategy) {
    super();
  }

  override canActivate(context: ExecutionContext) {
    if (!this.strategy.enabled) {
      throw new ServiceUnavailableException(
        'La connexion Google n’est pas configurée sur cet environnement.',
      );
    }
    return super.canActivate(context);
  }
}
