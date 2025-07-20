import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html'
})
export class TopbarComponent {
  constructor(public authService: AuthService, private router: Router) {}

   logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthRoute(): boolean {
    const path = this.router.url;
    return path === '/login' || path === '/register';
  }
}
