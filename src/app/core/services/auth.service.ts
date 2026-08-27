import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Observable,
  catchError,
  finalize,
  map,
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
} from '../../interfaces/login-response';
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '../../interfaces/change-password.interface';
import { AuthStateService } from './auth-state.service';
import { MockAuthService } from './mock-auth.service';

const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMINISTRATEUR: [
    'dashboard.read',
    'departments.read',
    'departments.create',
    'departments.update',
    'departments.deactivate',
    'employees.read',
    'employees.create',
    'employees.update',
    'employees.deactivate',
    'interns.read',
    'internships.read',
    'supervisors.read',
    'authorities.read',
    'projects.read',
    'users.read',
    'roles.read',
    'roles.create',
    'roles.update',
    'roles.deactivate',
  ],
  UTILISATEUR: [],
};

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
          this.state.setSession(response.accessToken, response.user, false),
        ),
      );
    }

    return this.http
      .post<BackendLoginResponse>(`${this.apiUrl}/login`, credentials)
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
      .get<BackendUser>(`${this.apiUrl}/me`)
      .pipe(
        map((user) => this.adaptBackendUser(user)),
        tap((user) => this.state.setUser(user)),
      );
  }

  initialize(): Observable<void> {
    if (this.environment.demoMode) {
      this.state.markInitialized();
      return of(undefined);
    }

    const accessToken = this.state.restoreAccessToken();
    if (!accessToken) {
      this.state.markInitialized();
      return of(undefined);
    }

    return this.getProfile().pipe(
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
    this.state.clear();
    return of(undefined);
  }

  private adaptBackendUser(user: BackendUser): AuthenticatedUser {
    return {
      ...user,
      position: null,
      permissions: ROLE_PERMISSIONS[user.role] ?? [],
    };
  }
}
