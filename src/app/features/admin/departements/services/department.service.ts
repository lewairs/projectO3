import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

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

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400 || error.status === 404) {
          return this.http.get<Department[]>(`${this.apiUrl}/path`);
        }

        return throwError(() => error);
      }),
    );
  }

  getById(id: string): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateDepartmentRequest): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, request);
  }

  update(
    id: string,
    request: UpdateDepartmentRequest,
  ): Observable<Department> {
    return this.http.patch<Department>(`${this.apiUrl}/${id}`, request);
  }

  deactivate(id: string): Observable<Department> {
    return this.http.delete<Department>(`${this.apiUrl}/${id}`);
  }
}
