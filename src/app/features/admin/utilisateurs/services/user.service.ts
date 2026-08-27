import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  readonly backendAvailable = false;
  readonly unavailableMessage = 'Back expose les employés, mais pas encore les comptes utilisateurs.';
}
