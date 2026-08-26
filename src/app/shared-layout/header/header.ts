import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AuthStateService } from '../../core/services/auth-state.service';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly layoutService = inject(LayoutService);
  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  readonly user = this.authState.user;
  readonly userMenuOpened = signal(false);
  readonly initials = computed(() => {
    const user = this.user();
    return user
      ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
      : '?';
  });
  readonly fullName = computed(() => {
    const user = this.user();
    return user ? `${user.firstName} ${user.lastName}` : 'Utilisateur';
  });
  readonly roleLabel = computed(() => {
    const labels: Record<string, string> = {
      ADMINISTRATEUR: 'Administrateur',
      ENCADRANT: 'Encadrant',
      STAGIAIRE: 'Stagiaire',
    };
    const role = this.user()?.role ?? '';
    return labels[role] ?? 'Utilisateur';
  });

  readonly applicationTitle = 'Gestion des stages';
  readonly companyName = 'Orange Mali';

  toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.userMenuOpened.update((opened) => !opened);
  }

  @HostListener('document:click')
  closeUserMenu(): void {
    this.userMenuOpened.set(false);
  }

  @HostListener('document:keydown.escape')
  closeUserMenuOnEscape(): void {
    this.closeUserMenu();
  }

  logout(): void {
    this.closeUserMenu();
    this.authService.logout().subscribe(() => {
      void this.router.navigate(['/login'], { replaceUrl: true });
    });
  }
}
