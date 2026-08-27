import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';
import { homeUrlFor } from '../auth/auth-navigation';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authState = inject(AuthStateService);
    const router = inject(Router);

    const user = authState.user();

    // Aucun utilisateur connecté
    if (!user) {
      return router.createUrlTree(['/login']);
    }

    // Vérification du rôle
    if (allowedRoles.includes(user.role)) {
      return true;
    }

    // Utilisateur connecté mais rôle non autorisé
    return router.parseUrl(homeUrlFor(user));
  };
};
