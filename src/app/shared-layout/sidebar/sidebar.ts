import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStateService } from '../../core/services/auth-state.service';
import { LayoutService } from '../../core/services/layout.service';
import { MenuItem } from '../../interfaces/menu-item.interface';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly layoutService = inject(LayoutService);
  private readonly authState = inject(AuthStateService);
  readonly role = computed(() => this.authState.user()?.role ?? 'UTILISATEUR');
  readonly sectionLabel = computed(() => {
    if (this.role() === 'ENCADRANT') return 'ENCADREMENT';
    if (this.role() === 'STAGIAIRE') return 'MON ESPACE';
    return 'GESTION';
  });

  private readonly menuItems: MenuItem[] = [

    {
      label: 'Tableau de bord',
      icon: 'fa-solid fa-house',
      route: '/dashboard',
      permission: 'dashboard.read',
      exact: true,
    },

    {
      label: 'Stagiaires',
      icon: 'fa-solid fa-user-graduate',
      route: '/dashboard/stagiaires',
      permission: 'interns.read',
    },

    {
      label: 'Stages',
      icon: 'fa-solid fa-folder-open',
      route: '/dashboard/stages',
      permission: 'internships.read',
    },

    {
      label: 'Départements',
      icon: 'fa-solid fa-building',
      route: '/dashboard/departements',
      permission: 'departments.read',
    },

    {
      label: 'Encadreurs',
      icon: 'fa-solid fa-chalkboard-user',
      route: '/dashboard/encadreurs',
      permission: 'supervisors.read',
    },

    {
      label: 'Autorités de tutelle',
      icon: 'fa-solid fa-sitemap',
      route: '/dashboard/autorites',
      permission: 'authorities.read',
    },

    {
      label: 'Projets',
      icon: 'fa-solid fa-diagram-project',
      route: '/dashboard/projets',
      permission: 'projects.read',
    }

  ];

  private readonly administrationItems: MenuItem[] = [

    {
      label: 'Utilisateurs',
      icon: 'fa-solid fa-users',
      route: '/dashboard/utilisateurs',
      permission: 'users.read',
    },

    {
      label: 'Rôles et permissions',
      icon: 'fa-solid fa-user-shield',
      route: '/dashboard/roles',
      permission: 'roles.read',
    },

    {
      label: 'Paramètres',
      icon: 'fa-solid fa-gear',
      route: '/dashboard/parametres'
    }

  ];

  private readonly supervisorItems: MenuItem[] = [
    { label: 'Vue d’ensemble', icon: 'fa-solid fa-table-columns', route: '/espace-encadrant', exact: true },
    { label: 'Mes stagiaires', icon: 'fa-solid fa-user-graduate', route: '/espace-encadrant/stagiaires' },
    { label: 'Validations', icon: 'fa-solid fa-list-check', route: '/espace-encadrant/validations' },
    { label: 'Évaluations', icon: 'fa-regular fa-star', route: '/espace-encadrant/evaluations' },
  ];

  private readonly internItems: MenuItem[] = [
    { label: 'Vue d’ensemble', icon: 'fa-solid fa-table-columns', route: '/espace-stagiaire', exact: true },
    { label: 'Mon stage', icon: 'fa-solid fa-briefcase', route: '/espace-stagiaire/stage' },
    { label: 'Mes livrables', icon: 'fa-regular fa-folder-open', route: '/espace-stagiaire/livrables' },
    { label: 'Mes documents', icon: 'fa-regular fa-file-lines', route: '/espace-stagiaire/documents' },
  ];

  readonly visibleMenuItems = computed(() => {
    if (this.role() === 'ENCADRANT') return this.supervisorItems;
    if (this.role() === 'STAGIAIRE') return this.internItems;
    return this.menuItems.filter(
      (item) => !item.permission || this.authState.hasPermission(item.permission),
    );
  });

  readonly visibleAdministrationItems = computed(() => {
    if (this.role() !== 'ADMINISTRATEUR') return [];
    return this.administrationItems.filter(
      (item) => !item.permission || this.authState.hasPermission(item.permission),
    );
  });
}
