import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from '../../shared-layout/header/header';
import { Sidebar } from '../../shared-layout/sidebar/sidebar';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {

  sidebarOpened = signal(true);

  constructor(public layoutService: LayoutService) {}

  toggleSidebar() {
    this.sidebarOpened.update(v => !v);
  }
}
