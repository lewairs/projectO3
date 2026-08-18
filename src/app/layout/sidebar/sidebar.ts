import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  constructor(public layoutService: LayoutService){}

  menuItems = [

    {
      label: 'Tableau de bord',
      icon: 'fa-solid fa-house',
      route: '/dashboard'
    },

    {
      label: 'Stagiaires',
      icon: 'fa-solid fa-user-graduate',
      route: '/stagiaires'
    },

    {
      label: 'Stages',
      icon: 'fa-solid fa-folder-open',
      route: '/stages'
    },

    {
      label: 'Départements',
      icon: 'fa-solid fa-building',
      route: '/departements'
    },

    {
      label: 'Encadreurs',
      icon: 'fa-solid fa-chalkboard-user',
      route: '/encadreurs'
    },

    {
      label: 'Autorités de tutelle',
      icon: 'fa-solid fa-sitemap',
      route: '/autorites'
    },

    {
      label: 'Projets',
      icon: 'fa-solid fa-diagram-project',
      route: '/projets'
    }

  ];

  administrationItems = [

    {
      label: 'Utilisateurs',
      icon: 'fa-solid fa-users',
      route: '/utilisateurs'
    },

    {
      label: 'Rôles et permissions',
      icon: 'fa-solid fa-user-shield',
      route: '/roles'
    },

    {
      label: 'Paramètres',
      icon: 'fa-solid fa-gear',
      route: '/parametres'
    }

  ];

}
