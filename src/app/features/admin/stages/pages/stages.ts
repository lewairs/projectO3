import { Component, signal } from '@angular/core';
import { SearchBar } from '../../../../shared/components/search-bar/search-bar';
import { Table, TableColumn } from '../../../../shared/components/table/table';

@Component({
  selector: 'app-stages',
  imports: [SearchBar, Table],
  templateUrl: './stages.html',
  styleUrl: './stages.css',
})
export class Stages {
  readonly search = signal('');
  readonly columns: TableColumn[] = [
    { key: 'reference', label: 'Référence' }, { key: 'intern', label: 'Stagiaire' },
    { key: 'department', label: 'Département' }, { key: 'supervisor', label: 'Encadreur' },
    { key: 'period', label: 'Période' }, { key: 'status', label: 'Statut' },
  ];
  readonly rows: Array<Record<string, unknown>> = [];
}
