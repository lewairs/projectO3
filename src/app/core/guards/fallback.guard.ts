import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStateService } from '../services/auth-state.service';
import { homeUrlFor } from '../auth/auth-navigation';

export const fallbackGuard: CanActivateFn = () => {
  const state = inject(AuthStateService);
  const router = inject(Router);
  return router.parseUrl(homeUrlFor(state.user()));
};
