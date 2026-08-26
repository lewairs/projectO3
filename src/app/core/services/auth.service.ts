import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Observable,
  catchError,
  finalize,
  map,
  of,
  switchMap,
  tap,
  timeout,
} from 'rxjs';

import { APP_ENVIRONMENT } from '../config/api.config';
import { AuthenticatedUser } from '../../interfaces/user';
import { LoginRequest } from '../../interfaces/login-request';
import {
  LoginResponse,
  RefreshResponse,
} from '../../interfaces/login-response';
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '../../interfaces/change-password.interface';
import { AuthStateService } from './auth-state.service';
import { MockAuthService } from './mock-auth.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly environment = inject(APP_ENVIRONMENT);
  private readonly state = inject(AuthStateService);
  private readonly mockAuthService = inject(MockAuthService);
  private readonly apiUrl = `${this.environment.apiBaseUrl}/auth`;

  login(credentials: LoginRequest): Observable<LoginResponse> {
    if (this.environment.demoMode) {
      return this.mockAuthService.login(credentials).pipe(
        tap((response) =>
          this.state.setSession(response.accessToken, response.user),
        ),
      );
    }

    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((response) =>
          this.state.setSession(response.accessToken, response.user),
        ),
      );
  }

  refresh(): Observable<RefreshResponse> {
    return this.http
      .post<RefreshResponse>(`${this.apiUrl}/refresh`, {}, {
        withCredentials: true,
      })
      .pipe(tap((response) => this.state.setAccessToken(response.accessToken)));
  }

  getProfile(): Observable<AuthenticatedUser> {
    return this.http
      .get<AuthenticatedUser>(`${this.apiUrl}/me`, { withCredentials: true })
      .pipe(tap((user) => this.state.setUser(user)));
  }

  initialize(): Observable<void> {
    if (this.environment.demoMode) {
      this.state.markInitialized();
      return of(undefined);
    }

    return this.refresh().pipe(
      timeout({ first: 5000 }),
      switchMap(() => this.getProfile()),
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
    if (this.environment.demoMode) {
      this.state.clear();
      return of(undefined);
    }

    return this.http
      .post<unknown>(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        map(() => undefined),
        catchError(() => of(undefined)),
        finalize(() => this.state.clear()),
      );
  }
}
