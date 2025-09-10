import { Component, Input, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../Services/user.service';
import { UserProfile } from '../../core/Models/UserProfileDto';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html'
})
export class TopbarComponent implements OnInit {
  @Input() isCollapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  isProfileDropdownOpen = false;
  userProfile = {
    name: 'Loading...',
    email: 'Loading...',
    avatar: 'https://ui-avatars.com/api/?name=User&background=1e40af&color=fff'
  };

  constructor(
    public authService: AuthService,
    private router: Router,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // 🚫 Don’t fire HTTP during SSR — only in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.loadUserProfile();
    }
  }

  loadUserProfile() {
    this.userService.getProfile().subscribe({
      next: (profile: UserProfile) => {
        const fullName = `${profile.firstName} ${profile.lastName}`.trim();
        this.userProfile = {
          name: fullName || 'User',
          email: profile.email,
          avatar: profile.profilePictureUrl
            ? `https://localhost:7187${profile.profilePictureUrl}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=1e40af&color=fff`
        };
      },
      error: (error) => {
        console.error('Failed to load user profile:', error);
        // keep defaults
      }
    });
  }

  onToggleCollapse() { this.toggleCollapse.emit(); }
  toggleProfileDropdown() { this.isProfileDropdownOpen = !this.isProfileDropdownOpen; }
  closeProfileDropdown() { this.isProfileDropdownOpen = false; }

  navigateToProfile() {
    this.router.navigate(['/manage']);
    this.closeProfileDropdown();
  }

  logout() {
    this.authService.logout();
    this.toastr.success('You have been logged out successfully', 'Logout Successful');
    this.closeProfileDropdown();
  }

  isAuthRoute(): boolean {
    const path = this.router.url;
    return path === '/login' || path === '/register';
  }
}
