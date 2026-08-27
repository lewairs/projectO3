import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  readonly notifications = signal(true);
  readonly confirmations = signal(true);
}
