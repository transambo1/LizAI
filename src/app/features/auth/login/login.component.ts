import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { SocialLoginComponent } from '../../../shared/components/social-link';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { customValidator } from '../../../core/validators/custom-valid';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    RouterLink,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    SocialLoginComponent,
    ReactiveFormsModule,
  ],
})
export class LoginComponent {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  errorMessage = '';
  showPassword = false;
  image = 'public/logo-short-white.svg';

  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, customValidator.passwordRange]),
  });
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.form.invalid) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    const { username, password } = this.form.value;
    this.authService.login(username!, password!).subscribe({
      next: (user) => {
        console.log('Login successful:', user);
        this.router.navigate(['/admin/users']);
      },
      error: (err: unknown) => {
        console.error('Login error:', err);
        this.errorMessage = 'Login with wrong username or password!';
      },
    });
  }
}
