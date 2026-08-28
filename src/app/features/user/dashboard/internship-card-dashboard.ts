import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { InternshipCard } from './internship-catalog.model';
import { InternshipCatalogService } from './internship-catalog.service';

const STATUS_LABELS: Record<string, string> = {
  PLANNED: 'Planifié', ONGOING: 'En cours', COMPLETED: 'Terminé', CANCELLED: 'Annulé',
  ON_HOLD: 'En attente', ASSIGNED: 'Affecté', IN_PROGRESS: 'En cours', REMOVED: 'Retiré',
};

@Component({
  selector: 'app-internship-card-dashboard',
  imports: [],
  templateUrl: './internship-card-dashboard.html',
  styleUrl: './internship-card-dashboard.css',
})
export class InternshipCardDashboard implements OnInit, OnDestroy {
  private readonly catalogService = inject(InternshipCatalogService);
  private readonly auth = inject(AuthService);
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);
  private searchTimer?: ReturnType<typeof setTimeout>;

  readonly user = this.authState.user;
  readonly internships = signal<InternshipCard[]>([]);
  readonly departments = signal<Array<{ id: string; code: string; name: string }>>([]);
  readonly summary = signal({ ongoingInternships: 0, plannedInternships: 0, activeProjects: 0 });
  readonly totalResults = signal(0);
  readonly totalPages = signal(1);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly search = signal('');
  readonly departmentFilter = signal('');
  readonly statusFilter = signal('');
  readonly projectStatusFilter = signal('');
  readonly page = signal(1);
  readonly pageSize = signal(6);
  readonly userMenuOpened = signal(false);

  readonly fullName = computed(() => {
    const user = this.user();
    return user ? `${user.firstName} ${user.lastName}` : 'Utilisateur';
  });

  readonly displayedRange = computed(() => {
    if (!this.totalResults()) return '0';
    const first = (this.page() - 1) * this.pageSize() + 1;
    const last = Math.min(this.page() * this.pageSize(), this.totalResults());
    return `${first}–${last}`;
  });

  ngOnInit(): void { this.loadInternships(); }
  ngOnDestroy(): void { if (this.searchTimer) clearTimeout(this.searchTimer); }

  loadInternships(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.catalogService.getCatalog({
      q: this.search(), departmentId: this.departmentFilter(), internshipStatus: this.statusFilter(),
      projectStatus: this.projectStatusFilter(), page: this.page(), limit: this.pageSize(),
    }).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (response) => {
        this.internships.set(response.items ?? []);
        this.departments.set(response.filters?.departments ?? []);
        this.summary.set(response.summary ?? this.summary());
        this.totalResults.set(response.pagination?.total ?? 0);
        this.totalPages.set(Math.max(1, response.pagination?.totalPages ?? 1));
      },
      error: (error: HttpErrorResponse) => {
        const message = error.error?.message;
        this.internships.set([]);
        this.errorMessage.set(error.status === 0 ? 'Le backend est inaccessible.'
          : Array.isArray(message) ? message.join(' ') : message || 'Impossible de charger les stages.');
      },
    });
  }

  updateSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
    this.page.set(1);
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.loadInternships(), 350);
  }
  updateDepartment(event: Event): void { this.departmentFilter.set((event.target as HTMLSelectElement).value); this.reloadFromFirstPage(); }
  updateStatus(event: Event): void { this.statusFilter.set((event.target as HTMLSelectElement).value); this.reloadFromFirstPage(); }
  updateProjectStatus(event: Event): void { this.projectStatusFilter.set((event.target as HTMLSelectElement).value); this.reloadFromFirstPage(); }
  updatePageSize(event: Event): void { this.pageSize.set(Number((event.target as HTMLSelectElement).value)); this.reloadFromFirstPage(); }
  previousPage(): void { if (this.page() > 1) { this.page.update((value) => value - 1); this.loadInternships(); } }
  nextPage(): void { if (this.page() < this.totalPages()) { this.page.update((value) => value + 1); this.loadInternships(); } }

  internName(item: InternshipCard): string { return this.personName(item.intern) || 'Stagiaire non renseigné'; }
  internInitials(item: InternshipCard): string {
    return `${item.intern?.firstName?.trim().charAt(0) ?? ''}${item.intern?.lastName?.trim().charAt(0) ?? ''}`.toUpperCase() || 'ST';
  }
  supervisorName(item: InternshipCard): string { return this.personName(item.supervisor?.employee) || 'Non attribué'; }
  authorityName(item: InternshipCard): string { return item.authority?.name || this.personName(item.authority?.employee) || 'Non renseignée'; }
  authorityTitle(item: InternshipCard): string { return item.authority?.signingTitle || 'Autorité de tutelle'; }
  project(item: InternshipCard) { return item.projectAssignments?.[0]?.project ?? null; }
  projectRole(item: InternshipCard): string { return item.projectAssignments?.[0]?.role || 'Projet associé'; }
  statusLabel(status?: string): string { return status ? STATUS_LABELS[status] ?? status : 'Non défini'; }
  statusClass(status?: string): string { return `status-${(status ?? 'unknown').toLowerCase().replace('_', '-')}`; }
  formatDate(value?: string): string {
    return value ? new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)) : '—';
  }

  toggleUserMenu(event: MouseEvent): void { event.stopPropagation(); this.userMenuOpened.update((opened) => !opened); }
  @HostListener('document:click') closeUserMenu(): void { this.userMenuOpened.set(false); }
  @HostListener('document:keydown.escape') closeOnEscape(): void { this.closeUserMenu(); }
  logout(): void { this.auth.logout().subscribe(() => void this.router.navigate(['/login'], { replaceUrl: true })); }

  private reloadFromFirstPage(): void { this.page.set(1); this.loadInternships(); }
  private personName(person?: { firstName?: string; lastName?: string } | null): string {
    return `${person?.firstName ?? ''} ${person?.lastName ?? ''}`.trim();
  }
}
