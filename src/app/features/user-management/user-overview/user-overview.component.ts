import { Component, inject } from '@angular/core';

import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../core/services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service.js';

@Component({
  standalone: true,
  selector: 'app-user-overview',
  templateUrl: './user-overview.component.html',
  imports: [MatButtonModule, MatIconModule],
})
export class UserOverviewComponent {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  currentUser = toSignal(this.authService.currentUser$);

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
