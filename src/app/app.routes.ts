import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { passwordChangeGuard } from './core/guards/password-change.guard';
import { permissionGuard } from './core/guards/permission.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'accueil',
    loadComponent: () =>
      import('./layouts/informative-layout/informative-layout').then(
        (m) => m.InformativeLayout,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/informative/accueil/accueil').then(
            (m) => m.Accueil,
          ),
      },
    ],
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'changer-mot-de-passe',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/auth/pages/change-password/change-password').then(
        (m) => m.ChangePassword,
      ),
  },
  {
    path: 'acces-refuse',
    loadComponent: () =>
      import('./features/auth/pages/access-denied/acces-refuse').then(
        (m) => m.AccessDenied,
      ),
  },
  {
    path: 'dashboard',
    canActivate: [
      authGuard,
      passwordChangeGuard,
      roleGuard(['ADMINISTRATEUR']),
    ],
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        canActivate: [permissionGuard('dashboard.read')],
        loadComponent: () =>
          import('./features/admin/dashboard/pages/dashboard/dashboard').then(
            (m) => m.Dashboard,
          ),
      },
      {
        path: 'stagiaires',
        canActivate: [permissionGuard('interns.read')],
        loadComponent: () =>
          import('./features/admin/stagiaires/pages/stagiaires').then(
            (m) => m.Stagiaires,
          ),
      },
      {
        path: 'stages',
        canActivate: [permissionGuard('internships.read')],
        loadComponent: () =>
          import('./features/admin/stages/pages/stages').then((m) => m.Stages),
      },
      {
        path: 'departements',
        canActivate: [permissionGuard('departments.read')],
        loadComponent: () =>
          import(
            './features/admin/departements/pages/departements/department-list'
          ).then(
            (m) => m.DepartmentList,
          ),
      },
      {
        path: 'encadreurs',
        canActivate: [permissionGuard('supervisors.read')],
        loadComponent: () =>
          import('./features/admin/encadreurs/pages/encadreurs').then(
            (m) => m.Encadreurs,
          ),
      },
      {
        path: 'autorites',
        canActivate: [permissionGuard('authorities.read')],
        loadComponent: () =>
          import('./features/admin/autorites/pages/autorites').then(
            (m) => m.Autorites,
          ),
      },
      {
        path: 'projets',
        canActivate: [permissionGuard('projects.read')],
        loadComponent: () =>
          import('./features/admin/projets/pages/projets').then(
            (m) => m.Projets,
          ),
      },
      {
        path: 'utilisateurs',
        canActivate: [permissionGuard('users.read')],
        loadComponent: () =>
          import('./features/admin/utilisateurs/pages/utilisateurs').then(
            (m) => m.Utilisateurs,
          ),
      },
      {
        path: 'roles',
        canActivate: [permissionGuard('roles.read')],
        loadComponent: () =>
          import('./features/admin/roles/pages/roles').then((m) => m.Roles),
      },
      {
        path: 'parametres',
        loadComponent: () =>
          import('./features/admin/parametres/pages/parametres').then(
            (m) => m.Parametres,
          ),
      },
    ],
  },
  {
    path: 'espace-encadrant',
    canActivate: [authGuard, passwordChangeGuard, roleGuard(['ENCADRANT'])],
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        data: { view: 'overview' },
        loadComponent: () =>
          import('./features/admin/encadreurs/pages/supervisor-space/espace-encadrant').then((m) => m.EspaceEncadrant),
      },
      {
        path: 'stagiaires',
        data: { view: 'stagiaires' },
        loadComponent: () =>
          import('./features/admin/encadreurs/pages/supervisor-space/espace-encadrant').then((m) => m.EspaceEncadrant),
      },
      {
        path: 'validations',
        data: { view: 'validations' },
        loadComponent: () =>
          import('./features/admin/encadreurs/pages/supervisor-space/espace-encadrant').then((m) => m.EspaceEncadrant),
      },
      {
        path: 'evaluations',
        data: { view: 'evaluations' },
        loadComponent: () =>
          import('./features/admin/encadreurs/pages/supervisor-space/espace-encadrant').then((m) => m.EspaceEncadrant),
      },
    ],
  },
  {
    path: 'espace-stagiaire',
    canActivate: [authGuard, passwordChangeGuard, roleGuard(['STAGIAIRE'])],
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        data: { view: 'overview' },
        loadComponent: () =>
          import('./features/admin/stagiaires/pages/intern-space/espace-stagiaire').then((m) => m.EspaceStagiaire),
      },
      {
        path: 'stage',
        data: { view: 'stage' },
        loadComponent: () =>
          import('./features/admin/stagiaires/pages/intern-space/espace-stagiaire').then((m) => m.EspaceStagiaire),
      },
      {
        path: 'livrables',
        data: { view: 'livrables' },
        loadComponent: () =>
          import('./features/admin/stagiaires/pages/intern-space/espace-stagiaire').then((m) => m.EspaceStagiaire),
      },
      {
        path: 'documents',
        data: { view: 'documents' },
        loadComponent: () =>
          import('./features/admin/stagiaires/pages/intern-space/espace-stagiaire').then((m) => m.EspaceStagiaire),
      },
    ],
  },
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  { path: '**', redirectTo: 'accueil' },
];
