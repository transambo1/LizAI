import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../core/services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
})
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private userId$ = this.route.paramMap.pipe(map((params) => params.get('id')));

  user = toSignal(this.userId$.pipe(switchMap((id) => this.userService.getUserById(id!))));

  // ngOnInit() {
  //   this.sub = this.route.paramMap
  //     .pipe(
  //       switchMap((params) => {
  //         const id = params.get('id');
  //         return this.userService.getUserById(id!);
  //       }),
  //     )
  //     .subscribe({
  //       next: (data) => {
  //         this.user = data;
  //       },
  //       error: (err) => console.error(' Cant to find out user ', err),
  //     });
  // }

  // ngOnDestroy() {
  //   this.sub.unsubscribe();
  // }
}
