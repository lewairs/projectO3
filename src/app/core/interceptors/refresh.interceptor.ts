import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, shareReplay, switchMap, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { AuthStateService } from '../services/auth-state.service';

let refreshRequest$: Observable<string> | null = null;

export const refreshInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const state = inject(AuthStateService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const code = error.error?.code;
      const isRefreshRequest = request.url.endsWith('/auth/refresh');
      if (error.status !== 401 || code !== 'ACCESS_TOKEN_EXPIRED' || isRefreshRequest) {
        return throwError(() => error);
      }

      refreshRequest$ ??= auth.refreshAccessToken().pipe(
        shareReplay({ bufferSize: 1, refCount: false }),
        finalize(() => (refreshRequest$ = null)),
      );

      return refreshRequest$.pipe(
        switchMap((accessToken) =>
          next(request.clone({
            withCredentials: true,
            setHeaders: { Authorization: `Bearer ${accessToken}` },
          })),
        ),
        catchError((refreshError) => {
          state.clear();
          void router.navigate(['/login'], { replaceUrl: true });
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
