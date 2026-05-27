import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';

// Material Modules (có thể xóa bớt MatTableModule nếu chỉ dùng ở BaseTable)
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Core Services & Shared Components
import { UserService } from '../../../core/services/user.service';
import { AlertService } from '../../../core/services/alert.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TableColumn } from '../../../shared/components/base-table/base-table.interface';
import { BaseTableComponent } from '../../../shared/components/base-table/base-table.component';
import { UserFormComponent } from '../../../shared/components/user-form/user-form.component';

import { User } from '../../../core/models/user.model';

@Component({
  standalone: true,
  selector: 'app-user-list',
  styleUrls: ['./user-list.component.css'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    BaseTableComponent,
  ],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  public userService = inject(UserService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private alertService = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);

  public userColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Tên người dùng' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Số điện thoại' },
    { key: 'website', label: 'Website' },
    { key: 'company.name', label: 'Công ty' },
    { key: 'actions', label: 'Thao tác', isAction: true, buttons: ['view', 'edit', 'delete'] },
  ];

  users = toSignal(this.userService.users$, { initialValue: [] });

  searchControl = new FormControl('');
  isSearching = false;
  isLoading = false;

  searchSub = this.searchControl.valueChanges
    .pipe(
      takeUntilDestroyed(),
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => (this.isSearching = true)),
      switchMap((value) =>
        this.userService.searchUsers(value || '').pipe(
          finalize(() => {
            this.isSearching = false;
            this.cdr.detectChanges();
          }),
        ),
      ),
    )
    .subscribe();

  ngOnInit() {
    this.isLoading = true;

    this.userService
      .getUsersFromServer()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe();
  }

  onView(userId: string) {
    this.router.navigate(['/admin/users', userId]);
  }

  // --- HÀM TẠO MỚI ---
  onCreate() {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '550px',
      data: { user: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService
          .createUser(result)
          .pipe(this.alertService.handle('Tạo người dùng'))
          .subscribe();
      }
    });
  }

  // --- HÀM CHỈNH SỬA ---
  onEdit(user: User) {
    const userId = user.id;
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '550px',
      data: { user: user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService
          .updateUser(userId, result)
          .pipe(this.alertService.handle('Cập nhật người dùng'))
          .subscribe();
      }
    });
  }

  // --- HÀM XÓA ---
  onDelete(userId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        titles: 'Xoá người dùng',
        message: `Bạn có chắc chắn muốn xoá User có ID là ${userId} không?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.userService
          .deleteUser(userId)
          .pipe(this.alertService.handle('Xóa người dùng'))
          .subscribe();
      }
    });
  }
}
