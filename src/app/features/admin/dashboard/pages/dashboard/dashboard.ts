import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { DashboardService } from '../../services/dashboard.service';
import { DashboardStat } from '../../interfaces/dashboard-stat.model';
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
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loading.set(true);
    this.dashboardService.getStats().pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (stats) => this.stats.set(stats),
      error: (error: HttpErrorResponse) => {
        const message = error.error?.message;
        this.errorMessage.set(error.status === 0 ? 'Le backend est inaccessible.' : Array.isArray(message) ? message.join(' ') : message || 'Impossible de charger les indicateurs.');
      },
    });
  }
}
