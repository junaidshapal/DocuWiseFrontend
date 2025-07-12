import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  form = { firstName: '', lastName: '', email: '', password: '' };

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
  console.log('Register form submitted with:', this.form);

  this.auth.register(this.form).subscribe({
    next: (res) => {
      console.log('Registration successful:', res);
      alert('Registration successful!');
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error('Registration failed:', err);
      alert('Registration failed');
    },
  });
}
}
