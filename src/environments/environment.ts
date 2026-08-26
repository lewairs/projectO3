export const environment = {
  production: false,
  // Le serveur Angular relaie /backend vers le PC qui héberge NestJS.
  // Cela permet au cookie HttpOnly de fonctionner en développement HTTP.
  apiBaseUrl: '/backend',
  demoMode: true,
} as const;
