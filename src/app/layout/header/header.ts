import { Component } from '@angular/core';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(public layoutService: LayoutService){}
  applicationTitle = 'Gestion des stagiaires';
  companyName = 'Orange Mali';
}
