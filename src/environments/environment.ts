export const environment = {
  production: false,
  // Le serveur Angular relaie /backend vers le PC qui héberge NestJS.
  // Le proxy conserve les appels dans la même origine pendant le développement.
  apiBaseUrl: 'http://10.175.2.72:3000',
} as const;
