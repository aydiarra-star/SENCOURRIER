import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Paginated<T> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export function buildPagination(
  page: number,
  perPage: number,
  total: number,
): Paginated<never>['meta'] {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  return {
    page,
    perPage,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
}

/**
 * Enveloppe les réponses dans `{ data, meta }`.
 *
 * Appliqué uniquement aux listes : les endpoints de détail renvoient l'entité
 * directement, ce qui garde les clients simples et les URL prévisibles.
 */
@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((payload: unknown) => {
        if (payload && typeof payload === 'object' && 'data' in payload && 'meta' in payload) {
          return payload;
        }
        return { data: payload };
      }),
    );
  }
}
