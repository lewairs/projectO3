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
import { authGuard } from './core/guards/auth-guard';
import { Accueil } from './pages/accueil/accueil';
import { MainLayout } from './layout/main-layout/main-layout';
import { EspaceEncadrant } from './pages/espace-encadrant/espace-encadrant';
import { EspaceStagiaire } from './pages/espace-stagiaire/espace-stagiaire';

export const routes: Routes = [

    {
        path: 'accueil',
        loadComponent: () => 
            import('./pages/accueil/accueil')
                .then(m => m.Accueil)
        
    },
    // ======================================

    {
        path: 'login',
        loadComponent: () => 
            import('./features/auth/pages/login/login')
                .then(m => m.Login)
        
    },

    // =============================================
    
    {
    path: 'dashboard',
    component: MainLayout,

        children: [
            {
            path: '',
            component: Dashboard
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
            }
        ]
    },
    {
        path: 'espace-encadrant',
        component: EspaceEncadrant
    },

    {
        path: 'espace-stagiaire',
        component: EspaceStagiaire
    },
    
    {
        path: '',
        redirectTo: 'accueil',
        pathMatch: 'full'
    },
    
    {
        path: '**',
        redirectTo: 'accueil'
    }
    
];
