export const environment = {
  production: false,
  // Le proxy Angular relaie /backend vers le PC qui héberge NestJS.
  // Le navigateur reste ainsi sur la même origine pendant le développement.
  apiBaseUrl: '/backend',
} as const;
