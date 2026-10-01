import { createParamDecorator, type ExecutionContext, SetMetadata } from '@nestjs/common';
import type { Role } from '@sencourrier/types';
import type { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
  displayName: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/** Injecte l'utilisateur authentifié (ou `undefined` sur une route publique). */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser | undefined => {
    return ctx.switchToHttp().getRequest<AuthenticatedRequest>().user;
  },
);

export const IS_PUBLIC_KEY = 'isPublic';

/** Marque une route comme accessible sans jeton d'accès. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'roles';

/** Restreint une route aux rôles fournis (RBAC, voir `packages/types`). */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
