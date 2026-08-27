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
  readonly sectionLabel = computed(() => 'GESTION');

  private readonly menuItems: MenuItem[] = [

    {
      label: 'Tableau de bord',
      icon: 'fa-solid fa-house',
      route: '/dashboard',
      permission: 'dashboard.read',
      exact: true,
    },
    { label: 'Stagiaires', icon: 'fa-solid fa-user-graduate', route: '/dashboard/stagiaires', permission: 'interns.read' },
    { label: 'Stages', icon: 'fa-solid fa-briefcase', route: '/dashboard/stages', permission: 'internships.read' },
    { label: 'Suivi des stages', icon: 'fa-solid fa-chart-line', route: '/dashboard/suivi-stages', permission: 'internships.read' },
    {
      label: 'Départements',
      icon: 'fa-solid fa-building',
      route: '/dashboard/departements',
      permission: 'departments.read',
    },
    { label: 'Encadreurs', icon: 'fa-solid fa-user-tie', route: '/dashboard/encadreurs', permission: 'supervisors.read' },
    { label: 'Autorités de tutelle', icon: 'fa-solid fa-landmark', route: '/dashboard/autorites', permission: 'authorities.read' },
    { label: 'Projets', icon: 'fa-solid fa-folder-open', route: '/dashboard/projets', permission: 'projects.read' },
    { label: 'Affectations', icon: 'fa-solid fa-diagram-project', route: '/dashboard/affectations', permission: 'project-assignments.read' },
  ];

  private readonly administrationItems: MenuItem[] = [
    { label: 'Postes', icon: 'fa-solid fa-id-badge', route: '/dashboard/postes', permission: 'positions.read' },
    {
      label: 'Employés',
      icon: 'fa-solid fa-users',
      route: '/dashboard/employes',
      permission: 'employees.read',
    },
    { label: 'Utilisateurs', icon: 'fa-solid fa-user-lock', route: '/dashboard/utilisateurs', permission: 'users.read' },
    {
      label: 'Rôles',
      icon: 'fa-solid fa-user-shield',
      route: '/dashboard/roles',
      permission: 'roles.read',
    },
    { label: 'Journal d’audit', icon: 'fa-solid fa-clock-rotate-left', route: '/dashboard/journal-audit', permission: 'audit-logs.read' },
    {
      label: 'Paramètres',
      icon: 'fa-solid fa-gear',
      route: '/dashboard/parametres'
    }

  ];

  readonly visibleMenuItems = computed(() => {
    return this.menuItems.filter(
      (item) => !item.permission || this.authState.hasPermission(item.permission),
    );
  });

  readonly visibleAdministrationItems = computed(() => {
    return this.administrationItems.filter(
      (item) => item.route === '/dashboard/parametres'
        ? this.role() === 'ADMINISTRATEUR'
        : !item.permission || this.authState.hasPermission(item.permission),
    );
  });
}
