import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isSidebarCollapsed = false;
  isAuthRoute = false;
  private authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

  constructor(private router: Router) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;
        this.isAuthRoute = this.authRoutes.some(p => url.startsWith(p));
      });
  }

  onToggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
