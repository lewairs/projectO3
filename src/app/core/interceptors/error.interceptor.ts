import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthStateService } from '../services/auth-state.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const state = inject(AuthStateService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const isLogin = request.url.endsWith('/auth/login');
      const code = error.error?.code;

      if (error.status === 401 && !isLogin && code !== 'ACCESS_TOKEN_EXPIRED') {
        state.clear();
        void router.navigate(['/login'], { replaceUrl: true });
      }

      if (error.status === 403 && code === 'PASSWORD_CHANGE_REQUIRED') {
        void router.navigate(['/changer-mot-de-passe']);
      } else if (error.status === 403) {
        void router.navigate(['/acces-refuse']);
      }

      return throwError(() => error);
    }),
  );
};
