import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  Observable,
  catchError,
  finalize,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

import { APP_ENVIRONMENT } from '../config/api.config';
import { ApiErrorBody } from '../../interfaces/api-error.interface';
import { RefreshResponse } from '../../interfaces/login-response';
import { AuthStateService } from '../services/auth-state.service';

let refreshInFlight$: Observable<RefreshResponse> | null = null;

export const refreshInterceptor: HttpInterceptorFn = (request, next) => {
  const state = inject(AuthStateService);
  const environment = inject(APP_ENVIRONMENT);
  const rawHttp = new HttpClient(inject(HttpBackend));

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const body = error.error as ApiErrorBody | undefined;
      const isRefresh = request.url.endsWith('/auth/refresh');

      if (
        error.status !== 401 ||
        body?.code !== 'ACCESS_TOKEN_EXPIRED' ||
        isRefresh
      ) {
        return throwError(() => error);
      }

      if (!refreshInFlight$) {
        refreshInFlight$ = rawHttp
          .post<RefreshResponse>(
            `${environment.apiBaseUrl}/auth/refresh`,
            {},
            { withCredentials: true },
          )
          .pipe(
            tap((response) => state.setAccessToken(response.accessToken)),
            finalize(() => {
              refreshInFlight$ = null;
            }),
            shareReplay({ bufferSize: 1, refCount: false }),
          );
      }

      return refreshInFlight$.pipe(
        switchMap((response) =>
          next(
            request.clone({
              withCredentials: true,
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`,
              },
            }),
          ),
        ),
      );
    }),
  );
};
