import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, of } from 'rxjs';

import { APP_ENVIRONMENT } from '../../../../core/config/api.config';
import {
  CreateDepartmentRequest,
  Department,
  UpdateDepartmentRequest,
} from '../interfaces/department.interface';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private readonly http = inject(HttpClient);
  private readonly environment = inject(APP_ENVIRONMENT);
  private readonly apiUrl = `${this.environment.apiBaseUrl}/departments`;
  private demoDepartements: Department[] = [
    {
      id: '11111111-1111-4111-8111-111111111111',
      code: 'DSI',
      name: 'Direction des systèmes d’information',
      description: 'Infrastructure, applications et cybersécurité',
      isActive: true,
      createdAt: '2026-08-20T08:00:00.000Z',
      updatedAt: '2026-08-20T08:00:00.000Z',
      createdById: null,
      updatedById: null,
    },
    {
      id: '22222222-2222-4222-8222-222222222222',
      code: 'RH',
      name: 'Ressources humaines',
      description: 'Gestion des collaborateurs et des stagiaires',
      isActive: true,
      createdAt: '2026-08-20T08:00:00.000Z',
      updatedAt: '2026-08-20T08:00:00.000Z',
      createdById: null,
      updatedById: null,
    },
  ];

  getAll(): Observable<Department[]> {
    if (this.environment.demoMode) {
      return of([...this.demoDepartements]).pipe(delay(250));
    }
    return this.http.get<Department[]>(`${this.apiUrl}/path`);
  }

  getById(id: string): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateDepartmentRequest): Observable<Department> {
    if (this.environment.demoMode) {
      const now = new Date().toISOString();
      const departement: Department = {
        id: crypto.randomUUID(),
        ...request,
        description: request.description ?? null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
        createdById: null,
        updatedById: null,
      };
      this.demoDepartements = [...this.demoDepartements, departement];
      return of(departement).pipe(delay(200));
    }
    return this.http.post<Department>(this.apiUrl, request);
  }

  update(
    id: string,
    request: UpdateDepartmentRequest,
  ): Observable<Department> {
    if (this.environment.demoMode) {
      const current = this.demoDepartements.find((item) => item.id === id)!;
      const updated: Department = {
        ...current,
        ...request,
        description: request.description ?? current.description,
        updatedAt: new Date().toISOString(),
      };
      this.demoDepartements = this.demoDepartements.map((item) =>
        item.id === id ? updated : item,
      );
      return of(updated).pipe(delay(200));
    }
    return this.http.patch<Department>(`${this.apiUrl}/${id}`, request);
  }

  deactivate(id: string): Observable<Department | undefined> {
    if (this.environment.demoMode) {
      this.demoDepartements = this.demoDepartements.filter(
        (item) => item.id !== id,
      );
      return of(undefined).pipe(delay(200));
    }
    return this.http.delete<Department>(`${this.apiUrl}/${id}`);
  }
}
