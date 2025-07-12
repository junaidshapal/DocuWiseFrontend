import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  form = { email: '', password: '' };

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    console.log('Login form submitted with:', this.form);

    this.auth.login(this.form).subscribe({
      next: (res) => {
        console.log('Login successful, received response:', res);
        
        this.auth.saveToken(res.token); // Save JWT
        this.router.navigate(['/documents']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Invalid login');
      },
    });
  }
}
