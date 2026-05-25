import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',

  imports: [RouterOutlet, RouterLink, CommonModule],
})
export class MainLayout {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser$ = this.authService.currentUser$;
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
