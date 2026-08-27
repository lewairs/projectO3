import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthStateService } from '../../../../core/services/auth-state.service';

@Component({
  selector: 'app-parametres',
  imports: [ReactiveFormsModule],
  templateUrl: './parametres.html',
  styleUrl: './parametres.css',
})
export class Parametres {
  private readonly authState = inject(AuthStateService);
  private readonly fb = inject(NonNullableFormBuilder);
  readonly user = this.authState.user;
  readonly savedMessage = signal('');
  readonly preferences = this.fb.group({
    emailNotifications: [true],
    compactSidebar: [false],
    confirmDestructiveActions: [true],
  });

  initials(): string {
    const user = this.user();
    return user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() : 'UT';
  }

  savePreferences(): void {
    this.savedMessage.set('Préférences enregistrées sur cet appareil.');
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('frontend_preferences', JSON.stringify(this.preferences.getRawValue()));
    }
  }
}
