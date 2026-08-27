import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { APP_ENVIRONMENT } from '../config/api.config';
import { AuthStateService } from '../services/auth-state.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const environment = inject(APP_ENVIRONMENT);

  if (!request.url.startsWith(environment.apiBaseUrl)) {
    return next(request);
  }

  const token = inject(AuthStateService).accessToken();
  return next(
    request.clone({
      setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    }),
  );
};
