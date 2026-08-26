import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-stagiaires',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './stagiaires.html',
  styleUrl: './stagiaires.css',
})
export class Stagiaires {

  search = '';
  selectedDepartement = '';
  selectedEncadreur = '';
  selectedStatut = '';
  dateDebut = '';
  dateFin = '';

  currentPage = 1;
  itemsPerPage = 10;

constructor(private fb: FormBuilder) {
    this.stagiaireForm = this.fb.group({
        nom: ['', Validators.required],
        departement: ['', Validators.required],
        encadreur: ['', Validators.required],
        projet: ['', Validators.required],
        dateDebut: ['', Validators.required],
        dateFin: ['', Validators.required],
        statut: ['En cours', Validators.required]

    });

}

  modalOpen = false;
  stagiaireForm!: FormGroup;

  stagiaires = [
  {
    id: 1,
    nom: 'Moussa Traoré',
    departement: 'Réseaux',
    encadreur: 'M. Diallo',
    debut: '01/07/2026',
    fin: '30/09/2026',
    statut: 'En cours'
  },

  {
    id: 2,
    nom: 'Fatoumata Keita',
    departement: 'RH',
    encadreur: 'Mme Camara',
    debut: '15/05/2026',
    fin: '15/08/2026',
    statut: 'Terminé'
  },

  {
    id: 3,
    nom: 'Oumar Konaté',
    departement: 'Finance',
    encadreur: 'M. Sidibé',
    debut: '01/10/2026',
    fin: '31/12/2026',
    statut: 'À venir'
  } 

  ];

  departements = [
    'Produits Factory',
    'Réseaux',
    'Cybersécurité',
    'Finance',
    'Marketing'
  ];

  encadreurs = [
    'Mme Coulibaly',
    'M. Diakité',
    'Mme Camara',
    'M. Sidibé'
  ];

  statuts = [
    'En cours',
    'Terminé',
    'À venir'
  ];

  getStatusClass(statut: string): string {
    switch (statut) {
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

  get filteredStagiaires() {

    return this.stagiaires.filter(stagiaire => {

      const matchSearch =
        stagiaire.nom
          .toLowerCase()
          .includes(this.search.toLowerCase());

      const matchDepartement =
        !this.selectedDepartement ||
        stagiaire.departement === this.selectedDepartement;

      const matchEncadreur =
        !this.selectedEncadreur ||
        stagiaire.encadreur === this.selectedEncadreur;

      const matchStatut =
        !this.selectedStatut ||
        stagiaire.statut === this.selectedStatut;

      return (
        matchSearch &&
        matchDepartement &&
        matchEncadreur &&
        matchStatut
      );

    });

  }

  resetFilters(): void {
    this.search = '';
    this.selectedDepartement = '';
    this.selectedEncadreur = '';
    this.selectedStatut = '';
    this.dateDebut = '';
    this.dateFin = '';
    this.currentPage = 1;
  }

  get paginatedStagiaires() {

    const start = (this.currentPage - 1) * this.itemsPerPage;

    const end = start + this.itemsPerPage;

    return this.filteredStagiaires.slice(start, end);

  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(
      this.filteredStagiaires.length / this.itemsPerPage
    ));

  }

  previousPage(): void {

    if (this.currentPage > 1) {
      this.currentPage--;
    }

  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  openModal(): void {
    this.modalOpen = true;

  }

  closeModal(): void {
      this.modalOpen = false;
      this.stagiaireForm.reset({
          statut:'En cours'
      });
  }

}
