import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
}
