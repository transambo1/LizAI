import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './user-form.component.html',
})

export class UserFormComponent {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<UserFormComponent>);
  public userForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {

    this.userForm = this.fb.group({
      name: [this.data?.user?.name || '', Validators.required],
      email: [this.data?.user?.email || '', Validators.required],
      username: [this.data?.user?.username || '', Validators.required],
      phone: [this.data?.user?.phone || '', Validators.required],
      website: [this.data?.user?.website || '', Validators.required],
      company: this.fb.group({
        name: [this.data?.user?.company?.name || ''],
      }),
    });
  }

  onSave() {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }
}
