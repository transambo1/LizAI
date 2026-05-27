import { Component, inject } from '@angular/core';

import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  public data = inject<{ title: string; message: string }>(MAT_DIALOG_DATA);
}
