import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStateService } from '../services/auth-state.service';

export const managementAreaGuard: CanActivateFn = () => {
  const state = inject(AuthStateService);
  const router = inject(Router);
  const user = state.user();
  if (!user) return router.createUrlTree(['/login']);
  return user.role === 'UTILISATEUR'
    ? router.createUrlTree(['/espace-utilisateur'])
    : true;
};
