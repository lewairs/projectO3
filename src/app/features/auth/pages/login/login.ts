import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';
import { APP_ENVIRONMENT } from '../../../../core/config/api.config';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  readonly demoMode = inject(APP_ENVIRONMENT).demoMode;

  isLoading = false;
  errorMessage = '';
  showPassword = false;

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['',[
      Validators.required,
      Validators.minLength(8),
    ],
  ],
  });



  // constructor(private fb: FormBuilder){

  //   this.loginForm = this.fb.group({

  //     email: [
  //       '',
  //       [
  //         Validators.required,
  //         Validators.email
  //       ]
  //     ],

  //     password: [
  //       '',
  //       [
  //         Validators.required,
  //         Validators.minLength(6)
  //       ]
  //     ]
  //   });
  // }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService
      .login(this.loginForm.getRawValue())
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          let target = '/dashboard';
          if (response.user.role === 'ENCADRANT') target = '/espace-encadrant';
          if (response.user.role === 'STAGIAIRE') target = '/espace-stagiaire';
          if (response.user.mustChangePassword) target = '/changer-mot-de-passe';
          void this.router.navigate([target], { replaceUrl: true });
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = this.getErrorMessage(error);
        },
      });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Le serveur est inaccessible. Vérifiez que le backend fonctionne.';
    }
    const backendMessage = error.error?.message;
    if (Array.isArray(backendMessage)) {
      return backendMessage.join(' ');
    }
    if (typeof backendMessage === 'string') {
      return backendMessage;
    }
    return 'Une erreur est survenue pendant la connexion.';
  }
}

