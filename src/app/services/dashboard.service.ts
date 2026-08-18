import { Injectable } from '@angular/core';
import { DashboardStat } from '../models/dashboard-stat.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  getStats(): DashboardStat[] {

    return [

      {
        title: 'Stagiaires',
        value: '67',
        subtitle: '+3 ce mois',
        icon: '👨‍🎓'
      },

      {
        title: 'Projets',
        value: '12',
        subtitle: 'Actifs',
        icon: '📁'
      },

      {
        title: 'Encadreurs',
        value: '8',
        subtitle: 'Disponibles',
        icon: '👨‍🏫'
      },

      {
        title: 'Départements',
        value: '5',
        subtitle: 'Entreprise',
        icon: '🏢'
      }

    ];

  }

}