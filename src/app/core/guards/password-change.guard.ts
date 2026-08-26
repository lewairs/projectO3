import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStateService } from '../services/auth-state.service';

export const passwordChangeGuard: CanActivateFn = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  return authState.user()?.mustChangePassword
    ? router.createUrlTree(['/changer-mot-de-passe'])
    : true;
};
