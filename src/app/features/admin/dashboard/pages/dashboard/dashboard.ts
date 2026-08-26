import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DashboardService } from '../../services/dashboard.service';
import { DashboardStat } from '../../interfaces/dashboard-stat.model';
import { QuickActions } from '../../components/quick-actions/quick-actions';
import { RecentActivity } from '../../components/recent-activity/recent-activity';
import { RecentInterns } from '../../components/recent-interns/recent-interns';
import { StatsCard } from '../../components/stats-card/stats-card';

@Component({
  selector: 'app-dashboard',
  imports: [
    StatsCard,
    RecentInterns,
    QuickActions,
    RecentActivity,
    RouterLink,
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
