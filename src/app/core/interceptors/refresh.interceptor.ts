import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Réservé à une future implémentation de refresh token côté backend.
 * Le contrat actuel ne fournit pas POST /auth/refresh ; cet interceptor
 * n'est donc pas enregistré dans app.config.ts.
 */
export const refreshInterceptor: HttpInterceptorFn = (request, next) =>
  next(request);
