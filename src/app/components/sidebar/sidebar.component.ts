import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isSidebarOpen = false;

  constructor(private router: Router) {}

  

  navigate(path: string) {
    this.router.navigate([path]);
    this.closeSidebar();
  }

  isAuthRoute(): boolean {
    const path = this.router.url;
    return path === '/login' || path === '/register';
  }
}
