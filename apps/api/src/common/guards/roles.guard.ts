import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_RANK, type Role } from '@sencourrier/types';
import { ROLES_KEY, type AuthenticatedRequest } from '../decorators/auth.decorators';

/**
 * Contrôle d'accès par rôle (RBAC).
 *
 * Un rôle supérieur hérite des droits des rôles inférieurs : `EDITOR_IN_CHIEF`
 * peut tout ce qu'un `JOURNALIST` peut faire. Voir `ROLE_RANK` dans
 * `@sencourrier/types` pour l'ordre de référence.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required || required.length === 0) return true;

    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!user) throw new ForbiddenException('Authentification requise.');

    const minimumRank = Math.min(...required.map((role) => ROLE_RANK[role]));
    if (ROLE_RANK[user.role] < minimumRank) {
      throw new ForbiddenException("Votre rôle ne permet pas d'accéder à cette ressource.");
    }

    return true;
  }
}
