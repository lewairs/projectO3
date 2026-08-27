import { Component, signal } from '@angular/core';
import { SearchBar } from '../../../../shared/components/search-bar/search-bar';
import { Table, TableColumn } from '../../../../shared/components/table/table';

@Component({
  selector: 'app-projets',
  imports: [SearchBar, Table],
  templateUrl: './projets.html',
  styleUrl: './projets.css',
})
export class Projets {
  readonly search = signal('');
  readonly columns: TableColumn[] = [
    { key: 'code', label: 'Code' }, { key: 'name', label: 'Projet' },
    { key: 'department', label: 'Département' }, { key: 'owner', label: 'Responsable' },
    { key: 'interns', label: 'Stagiaires' }, { key: 'status', label: 'Statut' },
  ];
  readonly rows: Array<Record<string, unknown>> = [];
}
