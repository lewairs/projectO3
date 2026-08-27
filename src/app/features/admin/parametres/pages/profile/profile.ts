import { Component, inject } from '@angular/core';
import { AuthStateService } from '../../../../../core/services/auth-state.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  readonly user = inject(AuthStateService).user;
  initials(): string {
    const user = this.user();
    return user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'UT';
  }
}
