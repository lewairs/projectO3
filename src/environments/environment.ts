export const environment = {
  production: false,
  // Le serveur Angular relaie /backend vers le PC qui héberge NestJS.
  // Le backend actuel utilise uniquement un access token Bearer.
  apiBaseUrl: 'http://10.175.2.72:3000',
} as const;
