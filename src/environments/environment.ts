export const environment = {
  production: false,
  // Le serveur Angular relaie /backend vers le PC qui héberge NestJS.
  // Le proxy conserve les appels dans la même origine pendant le développement.
  apiBaseUrl: '/backend',
} as const;
