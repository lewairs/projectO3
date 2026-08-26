import { Component, input } from '@angular/core'; 

@Component({
  selector: 'app-button',
  standalone:true,
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  label = input('Bouton');
  type = input<'button' | 'submit' | 'reset' >('button');
  disabled = input(false);
  fullWidth = input(false);
  variant = input<'primary' | 'secondary' | 'danger' | 'success'>('primary');
}
