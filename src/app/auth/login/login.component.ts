import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  form = { email: '', password: '' };
  showPassword = false;

  constructor(private auth: AuthService, private router: Router, private toastr: ToastrService) {}

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    console.log('Login form submitted with:', this.form);

    this.auth.login(this.form).subscribe({
      next: (res) => {
        console.log('Login successful, received response:', res);
        
        this.auth.saveToken(res.token); // Save JWT
        this.toastr.success('Login successful! Welcome back.', 'Success');
        this.router.navigate(['/documents']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.toastr.error('Invalid email or password. Please try again.', 'Login Failed');
      },
    });
  }
}
