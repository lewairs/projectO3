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
        path: 'employes',
        canActivate: [permissionGuard('employees.read')],
        loadComponent: () =>
          import('./features/admin/utilisateurs/pages/utilisateurs').then(
            (m) => m.Utilisateurs,
          ),
      },
      { path: 'utilisateurs', redirectTo: 'employes', pathMatch: 'full' },
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
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
