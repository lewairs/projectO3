import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.html',
  styleUrl: './input.css',
})
export class Input {
  readonly label = input('');
  readonly type = input<'text' | 'email' | 'password' | 'tel' | 'date' | 'number'>('text');
  readonly placeholder = input('');
  readonly value = input('');
  readonly name = input('field');
  readonly required = input(false);
  readonly disabled = input(false);
  readonly error = input('');
  readonly valueChange = output<string>();

  update(event: Event): void { this.valueChange.emit((event.target as HTMLInputElement).value); }
}
