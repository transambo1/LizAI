import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private snackBar = inject(MatSnackBar);

  handle<T>(actionName: string) {
    return (source: Observable<T>) => source.pipe(
      tap(() => this.success(`${actionName} thành công!`)),
      catchError((err) => {
        this.error(`${actionName} thất bại, thử lại nhé!`);
        return throwError(() => err);
      })
    );
  }
  
  success(message: string) {
    this.snackBar.open(message, ' Đóng ', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }

  error(message: string) {
    this.snackBar.open(message, ' Đóng ', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }
}
