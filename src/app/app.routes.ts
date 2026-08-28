import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { passwordChangeGuard } from './core/guards/password-change.guard';
import { permissionGuard } from './core/guards/permission.guard';
import { roleGuard } from './core/guards/role.guard';
import { fallbackGuard } from './core/guards/fallback.guard';
import { managementAreaGuard } from './core/guards/management-area.guard';

export const routes: Routes = [
  {
    path: 'accueil',
    canActivate: [guestGuard],
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
    path: 'espace-utilisateur',
    canActivate: [authGuard, passwordChangeGuard, roleGuard(['UTILISATEUR']), permissionGuard('dashboard.read')],
    loadComponent: () =>
      import('./features/user/dashboard/internship-card-dashboard').then((m) => m.InternshipCardDashboard),
  },
  {
    path: 'dashboard',
    canActivate: [
      authGuard,
      passwordChangeGuard,
      managementAreaGuard,
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
        path: 'departements',
        canActivate: [permissionGuard('departments.read')],
        loadComponent: () =>
          import('./features/admin/resource-page/resource-page').then((m) => m.ResourcePage),
        data: { resourceKey: 'departments' },
      },
      {
        path: 'postes',
        canActivate: [permissionGuard('positions.read')],
        loadComponent: () => import('./features/admin/resource-page/resource-page').then((m) => m.ResourcePage),
        data: { resourceKey: 'positions' },
      },
      {
        path: 'employes',
        canActivate: [permissionGuard('employees.read')],
        loadComponent: () => import('./features/admin/resource-page/resource-page').then((m) => m.ResourcePage),
        data: { resourceKey: 'employees' },
      },
      {
        path: 'stagiaires',
        canActivate: [permissionGuard('interns.read')],
        loadComponent: () => import('./features/admin/resource-page/resource-page').then((m) => m.ResourcePage),
        data: { resourceKey: 'interns' },
      },
      {
        path: 'encadreurs',
        canActivate: [permissionGuard('supervisors.read')],
        loadComponent: () => import('./features/admin/resource-page/resource-page').then((m) => m.ResourcePage),
        data: { resourceKey: 'supervisors' },
      },
      {
        path: 'autorites',
        canActivate: [permissionGuard('authorities.read')],
        loadComponent: () => import('./features/admin/resource-page/resource-page').then((m) => m.ResourcePage),
        data: { resourceKey: 'authorities' },
      },
      {
        path: 'stages',
        canActivate: [permissionGuard('internships.read')],
        loadComponent: () => import('./features/admin/resource-page/resource-page').then((m) => m.ResourcePage),
        data: { resourceKey: 'internships' },
      },
      {
        path: 'suivi-stages',
        canActivate: [permissionGuard('internships.read')],
        loadComponent: () => import('./features/admin/resource-page/resource-page').then((m) => m.ResourcePage),
        data: { resourceKey: 'tracking' },
      },
      {
        path: 'projets',
        canActivate: [permissionGuard('projects.read')],
        loadComponent: () => import('./features/admin/resource-page/resource-page').then((m) => m.ResourcePage),
        data: { resourceKey: 'projects' },
      },
      {
        path: 'affectations',
        canActivate: [permissionGuard('project-assignments.read')],
        loadComponent: () => import('./features/admin/resource-page/resource-page').then((m) => m.ResourcePage),
        data: { resourceKey: 'assignments' },
      },
      {
        path: 'journal-audit',
        canActivate: [permissionGuard('audit-logs.read')],
        loadComponent: () => import('./features/admin/resource-page/resource-page').then((m) => m.ResourcePage),
        data: { resourceKey: 'audit' },
      },
      {
        path: 'utilisateurs',
        canActivate: [permissionGuard('users.read')],
        loadComponent: () => import('./features/admin/users/pages/users').then((m) => m.Users),
      },
      {
        path: 'roles',
        canActivate: [permissionGuard('roles.read')],
        loadComponent: () =>
          import('./features/admin/roles/pages/roles').then((m) => m.Roles),
      },
      {
        path: 'parametres',
        canActivate: [roleGuard(['ADMINISTRATEUR'])],
        loadComponent: () =>
          import('./features/admin/parametres/pages/parametres').then(
            (m) => m.Parametres,
          ),
      },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '**',
    canActivate: [fallbackGuard],
    loadComponent: () => import('./features/auth/pages/access-denied/acces-refuse').then((m) => m.AccessDenied),
  },
];
