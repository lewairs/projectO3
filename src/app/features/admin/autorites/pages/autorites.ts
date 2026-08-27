import { Component, signal } from '@angular/core';
import { SearchBar } from '../../../../shared/components/search-bar/search-bar';
import { Table, TableColumn } from '../../../../shared/components/table/table';

@Component({
  selector: 'app-autorites',
  imports: [SearchBar, Table],
  templateUrl: './autorites.html',
  styleUrl: './autorites.css',
})
export class Autorites {
  readonly search = signal('');
  readonly columns: TableColumn[] = [
    { key: 'name', label: 'Établissement' }, { key: 'type', label: 'Type' },
    { key: 'contact', label: 'Contact principal' }, { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Téléphone' }, { key: 'interns', label: 'Stagiaires' },
  ];
  readonly rows: Array<Record<string, unknown>> = [];
}
