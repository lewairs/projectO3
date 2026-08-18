import { Component } from '@angular/core';

@Component({
  selector: 'app-recent-activity',
  imports: [],
  templateUrl: './recent-activity.html',
  styleUrl: './recent-activity.css'
})
export class RecentActivity {

  activities = [
    {
      icon: '🟢',
      message: 'Moussa Traoré a été ajouté.',
      date: 'Il y a 5 min'
    },
    {
      icon: '🟠',
      message: 'Projet "Refonte Site Web" créé.',
      date: 'Il y a 20 min'
    },
    {
      icon: '🔵',
      message: 'Fatoumata Diallo a terminé son stage.',
      date: 'Il y a 1 heure'
    },
    {
      icon: '🟣',
      message: 'Département Informatique ajouté.',
      date: 'Aujourd’hui'
    }
  ];

}