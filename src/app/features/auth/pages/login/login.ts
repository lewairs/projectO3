import { Component } from '@angular/core';
import { NonNullableFormBuilder, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';
// import { LoginRequest } from '../../../interfaces/login-request';
import { email } from '@angular/forms/signals';
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

  isLoading = false;
  errorMessage = '';
  showPassword = false;

  loginForm= this.fb.group({
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
  this.authService.login(this.loginForm.getRawValue())
    .pipe(
      finalize(()=>{
      this.isLoading = false;
      }),
    )
    .subscribe({
      next: (response) => {
        if(response.user.mustChangePassword){
          void this.router.navigate(['/dashboard']);
          return;
        }
        void this.router.navigate(['/dashboard']);
      },

      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(error);
        },
      });
    }
        // if(error.status === 0){
        //   'Le backend es inaccessible. Vérifiez que le serveur fonctionne.';
        //   return;
        // }
        // const message = error.error?.meassage;

        // this.errorMessage = Array.isArray(message) ? message.join('') : message || 'Email ou mot de passe incorrect.';
  
    private getErrorMessage(error:HttpErrorResponse):string {
      if(error.status === 0){
        return 'Le serveur est inaccessible.verifiez que le backend fonctionne.'
      }
      const backendMessage = error.error?.message;
      if(Array.isArray(backendMessage)){
        return backendMessage.join('')
      }
      if(typeof backendMessage === 'string'){
        return backendMessage;
      }
      return 'Une erreur est survenue pendant la connextion';
    }
}

