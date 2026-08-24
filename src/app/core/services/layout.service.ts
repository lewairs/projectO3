import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  sidebarOpened = signal(true);

  toggleSidebar() {
    this.sidebarOpened.update(value => !value);
  }

  openSidebar() {
    this.sidebarOpened.set(true);
  }

  closeSidebar() {
    this.sidebarOpened.set(false);
  }

}