import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();
  isSidebarOpen = false;

  menuItems = [
    { path: '/documents', label: 'Documents', icon: 'file-text' },
    { path: '/upload', label: 'Upload', icon: 'upload' },
    { path: '/favorites', label: 'Favorites', icon: 'star' },
    { path: '/manage', label: 'Manage Profile', icon: 'settings' }
  ];

  constructor(public router: Router) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onToggleCollapse() {
    this.toggleCollapse.emit();
  }

  navigate(path: string) {
    this.router.navigate([path]);
    this.closeSidebar();
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  isAuthRoute(): boolean {
    const path = this.router.url;
    return path === '/login' || path === '/register';
  }
}
