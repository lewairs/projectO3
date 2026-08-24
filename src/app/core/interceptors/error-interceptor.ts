import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AUTH_USER_KEY, AUTH_TOKEN_KEY } from '../services/auth.service';
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((error:HttpErrorResponse) => {
      const isLoginRequest = req.url.endsWith('/auth/login');

      if(error.status === 401 && !isLoginRequest){
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        sessionStorage.removeItem(AUTH_USER_KEY);

        void router.navigate(['/login']);
      }
      return throwError (() => error);
    }),
  );
};
