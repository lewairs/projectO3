import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Stagiaires } from './pages/stagiaires/stagiaires';
import { Stages } from './pages/stages/stages';
import { Departements } from './pages/departements/departements';
import { Encadreurs } from './pages/encadreurs/encadreurs';
import { Projets } from './pages/projets/projets';
import { Utilisateurs } from './pages/utilisateurs/utilisateurs';
import { Parametres } from './pages/parametres/parametres';
import { Login } from './features/auth/pages/login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate:[authGuard],
        
    },
    {
        path: 'stagiaires',
        component: Stagiaires
    },
    {
        path: 'departements',
        component: Departements
    },

    {
        path: 'encadreurs',
        component: Encadreurs
    },

    {
        path: 'projets',
        component: Projets
    },

    {
        path: 'utilisateurs',
        component: Utilisateurs
    },

    {
        path: 'parametres',
        component: Parametres
    },

    {
        path: '**',
        redirectTo: 'dashboard'
    }

];
