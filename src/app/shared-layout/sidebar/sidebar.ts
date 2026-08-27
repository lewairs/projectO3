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

    {
      label: 'Départements',
      icon: 'fa-solid fa-building',
      route: '/dashboard/departements',
      permission: 'departments.read',
    },

  ];

  private readonly administrationItems: MenuItem[] = [

    {
      label: 'Employés',
      icon: 'fa-solid fa-users',
      route: '/dashboard/employes',
      permission: 'employees.read',
    },

    {
      label: 'Rôles',
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

  readonly visibleMenuItems = computed(() => {
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
