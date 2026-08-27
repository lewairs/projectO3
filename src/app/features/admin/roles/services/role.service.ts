import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { APP_ENVIRONMENT } from '../../../../core/config/api.config';
import { CreateRoleRequest, Role, UpdateRoleRequest } from '../interfaces/role.model';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly http = inject(HttpClient);
  private readonly environment = inject(APP_ENVIRONMENT);
  private readonly apiUrl = `${this.environment.apiBaseUrl}/roles`;

  getAll(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  create(request: CreateRoleRequest): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, request);
  }

  update(id: string, request: UpdateRoleRequest): Observable<Role> {
    return this.http.patch<Role>(`${this.apiUrl}/${id}`, request);
  }

  deactivate(id: string): Observable<Role> {
    return this.http.delete<Role>(`${this.apiUrl}/${id}`);
  }
}
