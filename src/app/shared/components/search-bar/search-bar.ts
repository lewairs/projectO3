import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  readonly value = input('');
  readonly placeholder = input('Rechercher…');
  readonly label = input('Rechercher');
  readonly valueChange = output<string>();

  update(event: Event): void { this.valueChange.emit((event.target as HTMLInputElement).value); }
  clear(): void { this.valueChange.emit(''); }
}
