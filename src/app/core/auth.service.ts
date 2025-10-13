import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginDto } from './Models/login.dto';
import { RegisterDto } from './Models/register.dto';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'https://localhost:7187/api/Auth';
  private readonly TOKEN_KEY = 'token';
  private readonly isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  register(data: RegisterDto) {
    return this.http.post(`${this.api}/register`, data);
  }

  login(data: LoginDto) {
    return this.http.post<{ token: string }>(`${this.api}/login`, data);
  }

  saveToken(token: string): void {
    if (!this.isBrowser) return;
    try { localStorage.setItem(this.TOKEN_KEY, token); } catch {}
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    try { return localStorage.getItem(this.TOKEN_KEY); } catch { return null; }
  }

  clearToken(): void {
    if (!this.isBrowser) return;
    try { localStorage.removeItem(this.TOKEN_KEY); } catch {}
  }

  isLoggedIn(): boolean { return !!this.getToken(); }
  isAuthenticated(): boolean { return !!this.getToken(); }

  logout(): void {
    this.clearToken();
    this.router.navigate(['/login']);
  }
}
