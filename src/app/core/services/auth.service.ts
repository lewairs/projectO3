import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginRequest } from '../../interfaces/login-request';
import { LoginResponse } from '../../interfaces/login-response';
import { User } from '../../interfaces/user';

export const AUTH_TOKEN_KEY = 'access_token';
export const AUTH_USER_KEY = 'auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiBaseUrl}/auth`;

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      credentials).pipe(tap((response)=>{
        sessionStorage.setItem(AUTH_TOKEN_KEY,response.accessToken);

        sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
      }),
    );
  }

    // saveToken(token: string): void {
    //     localStorage.setItem('access_token', token);
    // }

    getProfile():Observable<User>{
      return this.http.get<User>(`${this.apiUrl}/me`);
    }

    getAccesToken(): string | null {
        return sessionStorage.getItem(AUTH_TOKEN_KEY);
    }

    getCurrentUser(): User | null {
      const storedUser = sessionStorage.getItem(AUTH_USER_KEY);
      if(!storedUser){
        return null;
      }
      try{
        return JSON.parse(storedUser) as User;
      } catch {
        return null;
      }
    }

    isAuthenticated():boolean{
      const token = this.getAccesToken();
      if(!token){
        return false;
      } try{
        const encodePayload = token.split('.')[1]
          .replace(/-/g, '+')
          .replace(/_/g, '+');
        const paddedPayload = encodePayload.padEnd(
          Math.ceil(encodePayload.length/4)*4,'='
        );
        const payload = JSON.parse(atob(paddedPayload)) as {
          exp?:number;
        };

        return(
          typeof payload.exp === 'number' && payload.exp* 1000 > Date.now()
        );
      } catch {
        return false;
      }

    }

    logout(): void {
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        sessionStorage.removeItem(AUTH_USER_KEY);
    }

    // isLoggedIn(): boolean {
    //     return this.getToken() !== null;
    // }

}