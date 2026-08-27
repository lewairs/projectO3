import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { DashboardService } from '../../services/dashboard.service';
import { DashboardStat } from '../../interfaces/dashboard-stat.model';
import { DashboardResponse } from '../../interfaces/dashboard.model';
import { QuickActions } from '../../components/quick-actions/quick-actions';
import { StatsCard } from '../../components/stats-card/stats-card';

@Component({
  selector: 'app-dashboard',
  imports: [
    StatsCard,
    QuickActions,
    RouterLink,
  ],

  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  readonly stats = signal<DashboardStat[]>([]);
  readonly dashboard = signal<DashboardResponse | null>(null);
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loading.set(true);
    this.dashboardService.getDashboard().pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (dashboard) => {
        this.dashboard.set(dashboard);
        this.stats.set([
          { title: 'Stagiaires', value: String(dashboard.summary.activeInterns), subtitle: `+${dashboard.summary.internsAddedThisMonth} ce mois`, icon: '🎓' },
          { title: 'Stages', value: String(dashboard.summary.activeInternships), subtitle: `${dashboard.summary.ongoingInternships} en cours`, icon: '💼' },
          { title: 'Projets', value: String(dashboard.summary.activeProjects), subtitle: `${dashboard.summary.ongoingProjects} en cours`, icon: '📁' },
          { title: 'Encadreurs', value: String(dashboard.summary.activeSupervisors), subtitle: `${dashboard.summary.activeDepartments} département(s)`, icon: '🧑‍💼' },
        ]);
      },
      error: (error: HttpErrorResponse) => {
        const message = error.error?.message;
        this.errorMessage.set(error.status === 0 ? 'Le backend est inaccessible.' : Array.isArray(message) ? message.join(' ') : message || 'Impossible de charger les indicateurs.');
      },
    });
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value));
  }
}
