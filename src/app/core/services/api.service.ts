import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
//import { Post } from '../models/post.model';

export interface ApiOptions {
  headers?: HttpHeaders | Record<string, string | string[]>;
  params?:
    | HttpParams
    | Record<string, string | number | boolean | readonly (string | number | boolean)[]>;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private snackBar = inject(MatSnackBar);

  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith('https://') || endpoint.startsWith('http://')) {
      return endpoint;
    }
    return `${this.baseUrl}/${endpoint}`;
  }

  private getRetryConfig() {
    return {
      count: 3,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        if (error.status >= 400 && error.status < 500) {
          return throwError(() => error);
        }

        const delayTime = Math.pow(2, retryCount - 1) * 1000;
        console.warn(`[API Network] Đang thử lại lần ${retryCount} sau ${delayTime}ms...`);
        return timer(delayTime);
      },
    };
  }

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = ' Đã có lỗi hệ thống xảy ra, Vui lòng thử lại sau!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = ` Lỗi mạng: Không thể kết nối đến máy chủ. `;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
          break;
        case 401:
          errorMessage = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
          break;
        case 403:
          errorMessage = 'Bạn không có quyền thực hiện thao tác này!';
          break;
        case 404:
          errorMessage = 'Không tìm thấy dữ liệu yêu cầu.';
          break;
        case 500:
          errorMessage = 'Máy chủ đang gặp sự cố. Vui lòng quay lại sau.';
          break;
        default:
          errorMessage = error.error?.message || errorMessage;
      }
    }

    this.snackBar.open(errorMessage, ' Đóng ', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['bg-red-500', 'text-white'],
    });

    console.error(`[Error Pipeline] Status: ${error.status} -  Message: ${errorMessage}`);
    return throwError(() => new Error(errorMessage));
  };

  // ĐÃ FIX: Áp dụng this.buildUrl(endpoint) cho tất cả các hàm và thêm lại retry cho get
  public get<T>(endpoint: string, options?: ApiOptions): Observable<T> {
    return this.http
      .get<T>(this.buildUrl(endpoint), options)
      .pipe(retry(this.getRetryConfig()), catchError(this.handleError));
  }

  public post<T>(endpoint: string, body: unknown, options?: ApiOptions): Observable<T> {
    return this.http
      .post<T>(this.buildUrl(endpoint), body, options)
      .pipe(retry(this.getRetryConfig()), catchError(this.handleError));
  }

  public put<T>(endpoint: string, body: unknown, options?: ApiOptions): Observable<T> {
    return this.http
      .put<T>(this.buildUrl(endpoint), body, options)
      .pipe(retry(this.getRetryConfig()), catchError(this.handleError));
  }

  public delete<T>(endpoint: string, options?: ApiOptions): Observable<T> {
    return this.http
      .delete<T>(this.buildUrl(endpoint), options)
      .pipe(retry(this.getRetryConfig()), catchError(this.handleError));
  }
}
