import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Observable,
  catchError,
  finalize,
  map,
  switchMap,
  of,
  tap,
  timeout,
} from 'rxjs';

import { APP_ENVIRONMENT } from '../config/api.config';
import { AuthenticatedUser, BackendUser } from '../../interfaces/user';
import { LoginRequest } from '../../interfaces/login-request';
import {
  BackendLoginResponse,
  LoginResponse,
  RefreshTokenResponse,
} from '../../interfaces/login-response';
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '../../interfaces/change-password.interface';
import { AuthStateService } from './auth-state.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly environment = inject(APP_ENVIRONMENT);
  private readonly state = inject(AuthStateService);
  private readonly apiUrl = `${this.environment.apiBaseUrl}/auth`;

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<BackendLoginResponse>(`${this.apiUrl}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        map((response): LoginResponse => ({
          ...response,
          user: this.adaptBackendUser(response.user),
        })),
        tap((response) =>
          this.state.setSession(response.accessToken, response.user),
        ),
      );
  }

  getProfile(): Observable<AuthenticatedUser> {
    return this.http
      .get<BackendUser>(`${this.apiUrl}/me`, { withCredentials: true })
      .pipe(
        map((user) => this.adaptBackendUser(user)),
        tap((user) => this.state.setUser(user)),
      );
  }

  refreshAccessToken(): Observable<string> {
    return this.http
      .post<RefreshTokenResponse>(`${this.apiUrl}/refresh`, {}, { withCredentials: true })
      .pipe(
        map((response) => response.accessToken),
        tap((accessToken) => this.state.setAccessToken(accessToken)),
      );
  }

  initialize(): Observable<void> {
    const accessToken = this.state.restoreAccessToken();
    const restoreSession = accessToken
      ? this.getProfile()
      : this.refreshAccessToken().pipe(switchMap(() => this.getProfile()));

    return restoreSession.pipe(
      timeout({ first: 5000 }),
      map(() => undefined),
      catchError(() => {
        this.state.clear();
        return of(undefined);
      }),
      finalize(() => this.state.markInitialized()),
    );
  }

  changePassword(
    request: ChangePasswordRequest,
  ): Observable<ChangePasswordResponse> {
    return this.http.patch<ChangePasswordResponse>(
      `${this.apiUrl}/change-password`,
      request,
    );
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        catchError(() => of(undefined)),
        finalize(() => this.state.clear()),
      );
  }

  private adaptBackendUser(user: BackendUser): AuthenticatedUser {
    return { ...user, position: user.position ?? null, permissions: user.permissions ?? [] };
  }
}
