import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDto } from './Models/login.dto';
import { RegisterDto } from './Models/register.dto';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'https://localhost:7187/api/Auth';

  constructor(private http: HttpClient, private router: Router) {}

  register(data: RegisterDto) {
    return this.http.post(`${this.api}/register`, data);
  }

  login(data: LoginDto) {
    return this.http.post<{ token: string }>(`${this.api}/login`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
