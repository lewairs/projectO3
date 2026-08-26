import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, switchMap } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';
import { AuthStateService } from '../../../../core/services/auth-state.service';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  readonly mandatory = this.authState.user()?.mustChangePassword ?? false;
  loading = false;
  errorMessage = '';
  showPasswords = false;

  readonly form = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.maxLength(128)]],
    newPassword: [
      '',
      [Validators.required, Validators.minLength(15), Validators.maxLength(128)],
    ],
    confirmNewPassword: [
      '',
      [Validators.required, Validators.minLength(15), Validators.maxLength(128)],
    ],
  });

  submit(): void {
    this.errorMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    if (values.newPassword !== values.confirmNewPassword) {
      this.errorMessage = 'La confirmation ne correspond pas au nouveau mot de passe.';
      return;
    }
    if (values.newPassword === values.currentPassword) {
      this.errorMessage = 'Le nouveau mot de passe doit être différent de l’ancien.';
      return;
    }

    this.loading = true;
    this.authService
      .changePassword(values)
      .pipe(
        switchMap(() => this.authService.logout()),
        finalize(() => (this.loading = false)),
      )
      .subscribe({
        next: () => {
          void this.router.navigate(['/login'], {
            replaceUrl: true,
            state: {
              message:
                'Mot de passe modifié. Reconnectez-vous avec votre nouveau mot de passe.',
            },
          });
        },
        error: (error: HttpErrorResponse) => {
          const message = error.error?.message;
          this.errorMessage = Array.isArray(message)
            ? message.join(' ')
            : message || 'Impossible de modifier le mot de passe.';
        },
      });
  }
}
