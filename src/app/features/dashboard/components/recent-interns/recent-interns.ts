import { Component } from '@angular/core';

@Component({
  selector: 'app-recent-interns',
  imports: [],
  templateUrl: './recent-interns.html',
  styleUrl: './recent-interns.css',
})
export class RecentInterns {
    interns = [
    {
      name: 'Moussa Traoré',
      department: 'Réseaux',
      status: 'En cours'
    },
    {
      name: 'Fatoumata Diallo',
      department: 'RH',
      status: 'Terminé'
    },
    {
      name: 'Oumar Konaté',
      department: 'Cybersécurité',
      status: 'À venir'
    },
    {
      name: 'Aïssata Dembélé',
      department: 'Finance',
      status: 'En cours'
    }
  ];

  getStatusClass(status: string): string {

  switch (status) {

    case 'En cours':
      return 'status-progress';

    case 'Terminé':
      return 'status-finished';

    case 'À venir':
      return 'status-coming';

    default:
      return '';

  }

}
}
