import { InjectionToken } from '@angular/core';

import { environment } from '../../../environments/environment';

export interface AppEnvironment {
  production: boolean;
  apiBaseUrl: string;
  demoMode: boolean;
}

export const APP_ENVIRONMENT = new InjectionToken<AppEnvironment>(
  'APP_ENVIRONMENT',
  { factory: () => environment },
);
