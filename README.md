# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Architecture du projet

Le frontend suit une architecture orientée fonctionnalités :

- `core/` contient uniquement l'infrastructure utilisée dans toute l'application : authentification, guards, interceptors, configuration et état global ;
- `shared/` contient les composants, directives et pipes réellement réutilisables par plusieurs fonctionnalités ;
- `layouts/` contient les structures complètes de pages (`admin-layout` et `informative-layout`) ;
- `shared-layout/` contient les éléments visuels qui composent ces structures (`header`, `sidebar`, `footer`) ;
- `features/auth/` contient le parcours d'authentification ;
- `features/admin/<domaine>/` regroupe les pages, services et interfaces de chaque fonctionnalité administrative ;
- `features/informative/` regroupe l'accueil public et les futures pages profil, projet, documents et actualités ;
- `interfaces/` contient uniquement les contrats transversaux partagés, par exemple la session, les réponses API et la pagination.

Une nouvelle fonctionnalité métier doit rester autonome : ses pages vont dans `features/<zone>/<domaine>/pages`, ses appels API dans `services` et ses contrats propres dans `interfaces`. Un élément ne remonte dans `core` ou `shared` que s'il est effectivement transversal.

### Espaces par rôle

- l'administrateur est dirigé vers `/dashboard` et dispose de toute la navigation de gestion ;
- l'encadrant est dirigé vers `/espace-encadrant` avec le suivi des stagiaires, les validations et les évaluations ;
- le stagiaire est dirigé vers `/espace-stagiaire` avec son stage, ses livrables et ses documents.

Ces trois espaces partagent le même langage visuel et le même shell, mais leurs routes sont protégées par rôle et leurs fonctionnalités restent séparées.

## Connexion au backend de développement

Le serveur Angular utilise `proxy.conf.json` pour relayer `/backend` vers le PC NestJS. Si l'adresse IP du PC backend change, mettez à jour uniquement la propriété `target` de ce fichier.

```text
Frontend  GET /backend/departments
Proxy     GET http://IP_DU_BACKEND:3000/departments
```

Lancez ensuite le frontend normalement :

```bash
npm start
```

Le backend doit écouter sur `0.0.0.0:3000` et autoriser l'origine utilisée par le frontend. Le JWT d'accès reste en mémoire et le refresh token est géré par le cookie HttpOnly du backend.
