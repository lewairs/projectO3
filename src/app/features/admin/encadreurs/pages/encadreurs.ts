import { Component, signal } from '@angular/core';
import { SearchBar } from '../../../../shared/components/search-bar/search-bar';
import { Table, TableColumn } from '../../../../shared/components/table/table';

@Component({
  selector: 'app-encadreurs',
  imports: [SearchBar, Table],
  templateUrl: './encadreurs.html',
  styleUrl: './encadreurs.css',
})
export class Encadreurs {
  readonly search = signal('');
  readonly columns: TableColumn[] = [
    { key: 'name', label: 'Encadreur' }, { key: 'employeeNumber', label: 'Matricule' },
    { key: 'department', label: 'Département' }, { key: 'jobTitle', label: 'Fonction' },
    { key: 'interns', label: 'Stagiaires suivis' }, { key: 'status', label: 'Disponibilité' },
  ];
  readonly rows: Array<Record<string, unknown>> = [];
}
