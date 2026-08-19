import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../../services/auth.service';
import { LoginRequest } from '../../../../interfaces/login-request';
import { email } from '@angular/forms/signals';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  errorMessage = '';

  loginForm= this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  showPassword = false;
  isLoading = false;


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
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }
  this.loading = true;
  this.errorMessage = '';
  this.authService.login(this.loginForm.value as any)
    .subscribe({
      next: (response) => {
        this.authService.saveToken(response.access_token);
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },

      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.error?.message || 'Email ou mot de passe incorrect';
      }
    });
}


}
