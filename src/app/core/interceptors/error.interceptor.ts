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

      if (error.status === 401 && !isLogin) {
        state.clear();
        void router.navigate(['/login'], { replaceUrl: true });
      }

      if (error.status === 403) {
        void router.navigate(['/acces-refuse']);
      }

      return throwError(() => error);
    }),
  );
};
