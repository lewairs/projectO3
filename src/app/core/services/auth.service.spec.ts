import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthStateService } from './auth-state.service';
import { AuthService } from './auth.service';
import { BackendLoginResponse } from '../../interfaces/login-response';
import { APP_ENVIRONMENT } from '../config/api.config';

describe('AuthService', () => {
  let service: AuthService;
  let state: AuthStateService;
  let http: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: APP_ENVIRONMENT,
          useValue: { production: false, apiBaseUrl: '/backend', demoMode: false },
        },
      ],
    });
    service = TestBed.inject(AuthService);
    state = TestBed.inject(AuthStateService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    sessionStorage.clear();
  });

  it('stores the access token and user after login', () => {
    const response: BackendLoginResponse = {
      accessToken: 'access-token',
      tokenType: 'Bearer',
      expiresIn: 900,
      user: {
        id: 'user-id',
        employeeId: 'employee-id',
        employeeNumber: 'EMP-001',
        firstName: 'Awa',
        lastName: 'Diallo',
        email: 'awa@example.com',
        jobTitle: 'Administratrice',
        department: null,
        role: 'ADMINISTRATEUR',
        mustChangePassword: false,
      },
    };

    service.login({ email: 'awa@example.com', password: 'password' }).subscribe();

    const request = http.expectOne('/backend/auth/login');
    expect(request.request.withCredentials).toBe(false);
    request.flush(response);

    expect(state.accessToken()).toBe('access-token');
    expect(state.user()?.email).toBe('awa@example.com');
    expect(state.user()?.position).toBeNull();
    expect(state.user()?.permissions).toContain('dashboard.read');
    expect(sessionStorage.getItem('access_token')).toBe('access-token');
  });

  it('restores a stored session through the backend profile endpoint', () => {
    sessionStorage.setItem('access_token', 'stored-token');

    service.initialize().subscribe();

    const request = http.expectOne('/backend/auth/me');
    expect(request.request.headers.get('Authorization')).toBeNull();
    request.flush({
      id: 'user-id',
      employeeId: 'employee-id',
      employeeNumber: 'EMP-001',
      firstName: 'Awa',
      lastName: 'Diallo',
      email: 'awa@example.com',
      jobTitle: 'Administratrice',
      department: null,
      role: 'ADMINISTRATEUR',
      mustChangePassword: false,
      lastLoginAt: '2026-08-26T16:00:00.000Z',
    });

    expect(state.accessToken()).toBe('stored-token');
    expect(state.user()?.role).toBe('ADMINISTRATEUR');
    expect(state.initialized()).toBe(true);
  });

  it('logs out locally without calling a backend endpoint', () => {
    state.setSession('access-token', {
      id: 'user-id',
      employeeId: 'employee-id',
      employeeNumber: 'EMP-001',
      firstName: 'Awa',
      lastName: 'Diallo',
      email: 'awa@example.com',
      jobTitle: 'Administratrice',
      position: null,
      department: null,
      role: 'ADMINISTRATEUR',
      permissions: ['dashboard.read'],
      mustChangePassword: false,
    });

    service.logout().subscribe();

    expect(state.accessToken()).toBeNull();
    expect(state.user()).toBeNull();
    expect(sessionStorage.getItem('access_token')).toBeNull();
  });
});
