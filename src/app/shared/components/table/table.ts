import { Component, input } from '@angular/core';

export interface TableColumn { key: string; label: string; }

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {
  readonly columns = input<TableColumn[]>([]);
  readonly rows = input<Array<Record<string, unknown>>>([]);
  readonly emptyTitle = input('Aucune donnée enregistrée');
  readonly emptyMessage = input('Les prochains éléments apparaîtront ici.');

  display(row: Record<string, unknown>, key: string): string {
    const value = row[key];
    return value === null || value === undefined || value === '' ? '—' : String(value);
  }
}
