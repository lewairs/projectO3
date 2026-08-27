import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { APP_ENVIRONMENT } from '../../../core/config/api.config';
import { AuthService } from '../../../core/services/auth.service';
import { AuthStateService } from '../../../core/services/auth-state.service';

interface TrackingRow {
  id: string;
  referenceCode?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  intern?: { firstName?: string; lastName?: string; registrationCode?: string };
  department?: { id?: string; name?: string };
  supervisor?: { fullName?: string; employee?: { firstName?: string; lastName?: string } };
  [key: string]: unknown;
}

interface DashboardResponse {
  internshipTracking?: TrackingRow[] | { items?: TrackingRow[] };
}

@Component({
  selector: 'app-user-dashboard',
  imports: [],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboard implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly environment = inject(APP_ENVIRONMENT);
  private readonly auth = inject(AuthService);
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  readonly user = this.authState.user;
  readonly data = signal<DashboardResponse>({});
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly search = signal('');
  readonly departmentFilter = signal('');
  readonly statusFilter = signal('');
  readonly yearFilter = signal('');
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly userMenuOpened = signal(false);

  readonly fullName = computed(() => {
    const user = this.user();
    return user ? `${user.firstName} ${user.lastName}` : 'Utilisateur';
  });

  readonly rows = computed<TrackingRow[]>(() => {
    const tracking = this.data().internshipTracking;
    if (Array.isArray(tracking)) return tracking;
    return tracking?.items ?? [];
  });

  readonly departments = computed(() =>
    [...new Set(this.rows().map((row) => row.department?.name).filter(Boolean) as string[])].sort(),
  );
  readonly statuses = computed(() =>
    [...new Set(this.rows().map((row) => row.status).filter(Boolean) as string[])].sort(),
  );
  readonly years = computed(() =>
    [...new Set(this.rows().map((row) => this.year(row)).filter(Boolean))].sort().reverse(),
  );

  readonly filteredRows = computed(() => {
    const query = this.search().trim().toLocaleLowerCase('fr');
    return this.rows().filter((row) => {
      const values = [
        row.referenceCode,
        row.title,
        row.intern?.registrationCode,
        row.intern?.firstName,
        row.intern?.lastName,
        row.department?.name,
        this.supervisorName(row),
      ].join(' ').toLocaleLowerCase('fr');
      return (!query || values.includes(query))
        && (!this.departmentFilter() || row.department?.name === this.departmentFilter())
        && (!this.statusFilter() || row.status === this.statusFilter())
        && (!this.yearFilter() || this.year(row) === this.yearFilter());
    });
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredRows().length / this.pageSize())));
  readonly pagedRows = computed(() => {
    const safePage = Math.min(this.page(), this.totalPages());
    const start = (safePage - 1) * this.pageSize();
    return this.filteredRows().slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.http.get<DashboardResponse>(`${this.environment.apiBaseUrl}/dashboard`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.data.set(data),
        error: (error: HttpErrorResponse) => {
          const message = error.error?.message;
          this.errorMessage.set(error.status === 0 ? 'Le backend est inaccessible.' : Array.isArray(message) ? message.join(' ') : message || 'Impossible de charger votre tableau de bord.');
        },
      });
  }

  updateSearch(event: Event): void { this.search.set((event.target as HTMLInputElement).value); this.page.set(1); }
  updateDepartment(event: Event): void { this.departmentFilter.set((event.target as HTMLSelectElement).value); this.page.set(1); }
  updateStatus(event: Event): void { this.statusFilter.set((event.target as HTMLSelectElement).value); this.page.set(1); }
  updateYear(event: Event): void { this.yearFilter.set((event.target as HTMLSelectElement).value); this.page.set(1); }
  updatePageSize(event: Event): void { this.pageSize.set(Number((event.target as HTMLSelectElement).value)); this.page.set(1); }
  previousPage(): void { this.page.update((value) => Math.max(1, value - 1)); }
  nextPage(): void { this.page.update((value) => Math.min(this.totalPages(), value + 1)); }

  internName(row: TrackingRow): string {
    return `${row.intern?.firstName ?? ''} ${row.intern?.lastName ?? ''}`.trim() || '—';
  }

  supervisorName(row: TrackingRow): string {
    if (row.supervisor?.fullName) return row.supervisor.fullName;
    const employee = row.supervisor?.employee;
    return `${employee?.firstName ?? ''} ${employee?.lastName ?? ''}`.trim() || '—';
  }

  year(row: TrackingRow): string { return row.startDate ? String(new Date(row.startDate).getFullYear()) : ''; }

  formatDate(value?: string): string {
    return value ? new Intl.DateTimeFormat('fr-FR').format(new Date(value)) : '—';
  }

  toggleUserMenu(event: MouseEvent): void { event.stopPropagation(); this.userMenuOpened.update((opened) => !opened); }
  @HostListener('document:click') closeUserMenu(): void { this.userMenuOpened.set(false); }
  @HostListener('document:keydown.escape') closeOnEscape(): void { this.closeUserMenu(); }

  logout(): void {
    this.auth.logout().subscribe(() => void this.router.navigate(['/login'], { replaceUrl: true }));
  }
}
