import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStateService } from '../services/auth-state.service';

export const permissionGuard = (permission: string): CanActivateFn => {
  return () => {
    const authState = inject(AuthStateService);
    const router = inject(Router);

    if (!authState.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }

    return authState.hasPermission(permission)
      ? true
      : router.createUrlTree(['/acces-refuse']);
  };
};
