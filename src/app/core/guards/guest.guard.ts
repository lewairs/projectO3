import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStateService } from '../services/auth-state.service';

export const guestGuard: CanActivateFn = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (!authState.isAuthenticated()) {
    return true;
  }

  const user = authState.user();
  if (user?.mustChangePassword) {
    return router.createUrlTree(['/changer-mot-de-passe']);
  }

  return router.createUrlTree([
    user?.role === 'ADMINISTRATEUR' ? '/dashboard' : '/accueil',
  ]);
};
