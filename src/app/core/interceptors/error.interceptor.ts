import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { ApiErrorBody } from '../../interfaces/api-error.interface';
import { AuthStateService } from '../services/auth-state.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const state = inject(AuthStateService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const body = error.error as ApiErrorBody | undefined;
      const code = body?.code;
      const isLogin = request.url.endsWith('/auth/login');
      const isRefresh = request.url.endsWith('/auth/refresh');

      if (error.status === 403 && code === 'PASSWORD_CHANGE_REQUIRED') {
        void router.navigate(['/changer-mot-de-passe'], { replaceUrl: true });
        return throwError(() => error);
      }

      if (error.status === 401 && !isLogin && !isRefresh) {
        state.clear();
        void router.navigate(['/login'], { replaceUrl: true });
      }

      return throwError(() => error);
    }),
  );
};
