import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AuthenticatedUser } from '../../interfaces/user';
import { LoginRequest } from '../../interfaces/login-request';
import { LoginResponse } from '../../interfaces/login-response';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {

  login(credentials: LoginRequest): Observable<LoginResponse> {

    const users: Array<{
        email: string;
        password: string;
        role: AuthenticatedUser['role'];
        permissions: string[];
      }>= [

      {
        email: 'admin@test.com',
        password: 'Test@123456',
        role: 'ADMINISTRATEUR',
        permissions: [
          'dashboard.read',
          'departments.read',
          'departments.create',
          'departments.update',
          'departments.deactivate',
          'interns.read',
          'internships.read',
          'supervisors.read',
          'authorities.read',
          'projects.read',
          'users.read',
          'roles.read',
        ],
      },
      {
        email: 'encadrant@test.com',
        password: 'Test@123456',
        role: 'ENCADRANT',
        permissions: ['dashboard.read', 'interns.read', 'internships.read'],
      },
      {
        email: 'stagiaire@test.com',
        password: 'Test@123456',
        role: 'STAGIAIRE',
        permissions: ['dashboard.read', 'internships.read'],
      }
    ];

    const user = users.find(
      u =>
        u.email === credentials.email &&
        u.password === credentials.password
    );

    if (!user) {
      return throwError(() => ({
        error: {
          message: 'Email ou mot de passe incorrect.'
        }
      }));
    }

    const response: LoginResponse = {
      accessToken: this.createFakeToken(),
      tokenType:'Bearer',
      expiresIn: 3600,
      refreshExpiresIn: 604800,
      user: {
      id: '11c01e02-a593-457c-a2c3-d137ff4cb371',
      employeeId: '35ea0722-57ef-44bc-ae99-bbed5762a307',
      employeeNumber: '001',
      firstName: 'Utilisateur',
      lastName: 'Test',
      email: user.email,
      jobTitle: 'Utilisateur de test',
      position: {
        id: '11111111-1111-4111-8111-111111111111',
        code: 'TEST',
        name: 'Utilisateur de test',
      },
      department: {
        id: '1',
        name: 'Informatique',
        code: 'INFO'
      },
      role: user.role,
      permissions: user.permissions,
      mustChangePassword: false
          }
    };

    return of(response).pipe(
      delay(500)
    );
  }

  private createFakeToken(): string {

    const header = btoa(
      JSON.stringify({
        alg: 'HS256',
        typ: 'JWT'
      })
    );

    const payload = btoa(
      JSON.stringify({
        sub: 'test-user',
        exp: Math.floor(Date.now() / 1000) + 3600
      })
    );

    const signature = 'simulation';

    return `${header}.${payload}.${signature}`;
  }
}
