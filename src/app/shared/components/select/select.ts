import { Component, input, output } from '@angular/core';

export interface SelectOption { label: string; value: string; }

@Component({
  selector: 'app-select',
  imports: [],
  templateUrl: './select.html',
  styleUrl: './select.css',
})
export class Select {
  readonly label = input('');
  readonly name = input('select');
  readonly value = input('');
  readonly placeholder = input('Sélectionner');
  readonly options = input<SelectOption[]>([]);
  readonly disabled = input(false);
  readonly valueChange = output<string>();

  update(event: Event): void { this.valueChange.emit((event.target as HTMLSelectElement).value); }
}
