import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService);

  private currentUserSubject = new BehaviorSubject<User>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  login(username: string, password: string) {
    return this.api.post<User>('auth/login', { username, password }).pipe(
      tap((user) => {
        this.setCurrentUser(user);
      }),
    );
  }

  setCurrentUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    const userString = localStorage.getItem('currentUser');
    if (!userString) return false;

    const user = JSON.parse(userString);
    return !!user.accessToken;
  }
}
