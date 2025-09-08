import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  form = { firstName: '', lastName: '', email: '', password: '' };
  showPassword = false;

  constructor(private auth: AuthService, private router: Router, private toastr: ToastrService) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    console.log('Register form submitted with:', this.form);

    this.auth.register(this.form).subscribe({
      next: (res) => {
        console.log('Registration successful:', res);
        this.toastr.success('Account created successfully! Please login to continue.', 'Registration Successful');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.toastr.error('Registration failed. Please try again.', 'Registration Failed');
      },
    });
  }
}
