import { Component } from '@angular/core';

import { StatsCard } from '../../features/dashboard/components/stats-card/stats-card';
import { RecentInterns } from '../../features/dashboard/components/recent-interns/recent-interns';
import { QuickActions } from '../../features/dashboard/components/quick-actions/quick-actions';
import { RecentActivity } from '../../features/dashboard/components/recent-activity/recent-activity';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStat } from '../../models/dashboard-stat.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    StatsCard,
    RecentInterns,
    QuickActions,
    RecentActivity
  ],

  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  stats: DashboardStat[] = [];

  constructor(private dashboardService: DashboardService){

    this.stats = this.dashboardService.getStats();

  }

//   stats = [
//   {
//     title: 'Stagiaires',
//     value: '67',
//     subtitle: '+3 ce mois',
//     icon: '👨‍🎓'
//   },
//   {
//     title: 'Projets',
//     value: '12',
//     subtitle: 'Actifs',
//     icon: '📁'
//   },
//   {
//     title: 'Encadreurs',
//     value: '8',
//     subtitle: 'Disponibles',
//     icon: '👨‍🏫'
//   },
//   {
//     title: 'Départements',
//     value: '5',
//     subtitle: 'Entreprise',
//     icon: '🏢'
//   }
// ];
}