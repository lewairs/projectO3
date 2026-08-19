import { Component, signal, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from '../../layout/header/header';
import { Sidebar } from '../sidebar/sidebar';
import { LayoutService} from '../../services/layout.service'

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  constructor(public layoutService: LayoutService){}

  private router = inject(Router);

  sidebarOpened = signal(true);

   toggleSidebar() {
    this.sidebarOpened.update(v => !v);
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';}
  
}
