import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${enviroment.apiUrl}/auth/login`;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  login(username: string, password: string) {
    return this.http.post<any>(this.apiUrl, { username, password }).pipe(
      tap((user) => {
        this.setCurrentUser(user);
      }),
    );
  }

  setCurrentUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));

    this.currentUserSubject.next(user);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('currentUser');
    return !!token;
  }
}
