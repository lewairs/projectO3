import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthStateService } from './auth-state.service';
import { AuthService } from './auth.service';
import { LoginResponse } from '../../interfaces/login-response';
import { APP_ENVIRONMENT } from '../config/api.config';

describe('AuthService', () => {
  let service: AuthService;
  let state: AuthStateService;
  let http: HttpTestingController;

  beforeEach(() => {
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

  afterEach(() => http.verify());

  it('stores the access token and user after login', () => {
    const response: LoginResponse = {
      accessToken: 'access-token',
      tokenType: 'Bearer',
      expiresIn: 900,
      refreshExpiresIn: 604800,
      user: {
        id: 'user-id',
        employeeId: 'employee-id',
        employeeNumber: 'EMP-001',
        firstName: 'Awa',
        lastName: 'Diallo',
        email: 'awa@example.com',
        jobTitle: 'Administratrice',
        position: { id: 'position-id', code: 'ADMIN', name: 'Administratrice' },
        department: null,
        role: 'ADMINISTRATEUR',
        permissions: ['dashboard.read'],
        mustChangePassword: false,
      },
    };

    service.login({ email: 'awa@example.com', password: 'password' }).subscribe();

    const request = http.expectOne('/backend/auth/login');
    expect(request.request.withCredentials).toBe(true);
    request.flush(response);

    expect(state.accessToken()).toBe('access-token');
    expect(state.user()?.email).toBe('awa@example.com');
  });
});
