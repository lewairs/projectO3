import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [],
  templateUrl: './stats-card.html',
  styleUrl: './stats-card.css'
})
export class StatsCard {

  title = input.required<string>();

  value = input.required<string>();

  subtitle = input('');

  icon = input('📊');

}