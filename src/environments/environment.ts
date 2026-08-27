export const environment = {
  production: false,
  // Le serveur Angular relaie /backend vers le PC qui héberge NestJS.
  // Le backend actuel utilise uniquement un access token Bearer.
  apiBaseUrl: '/backend',
  demoMode: false,
} as const;
