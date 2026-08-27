import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { APP_ENVIRONMENT } from '../../../../core/config/api.config';
import { CreateUserAccount, UserAccount, UserEmployee, UserRole } from '../interfaces/user-account.model';

@Injectable({ providedIn: 'root' })
export class UserAccountService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(APP_ENVIRONMENT).apiBaseUrl}`;

  getAll(): Observable<UserAccount[]> { return this.http.get<UserAccount[]>(`${this.baseUrl}/users`); }
  getEmployees(): Observable<UserEmployee[]> { return this.http.get<UserEmployee[]>(`${this.baseUrl}/employees`); }
  getRoles(): Observable<UserRole[]> { return this.http.get<UserRole[]>(`${this.baseUrl}/roles`); }
  create(payload: CreateUserAccount): Observable<UserAccount> { return this.http.post<UserAccount>(`${this.baseUrl}/users`, payload); }
  update(id: string, payload: { roleId?: string; isActive?: boolean }): Observable<UserAccount> { return this.http.patch<UserAccount>(`${this.baseUrl}/users/${id}`, payload); }
  resetPassword(id: string, payload: { newPassword: string; confirmNewPassword: string; mustChangePassword: boolean }): Observable<UserAccount> { return this.http.patch<UserAccount>(`${this.baseUrl}/users/${id}/reset-password`, payload); }
  deactivate(id: string): Observable<UserAccount> { return this.http.delete<UserAccount>(`${this.baseUrl}/users/${id}`); }
}
