import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api = inject(ApiService);
  private jsonUrl = environment.jsonApiUrl;

  private usersSubject$ = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject$.asObservable();

  getUsersFromServer(): Observable<User[]> {
    if (this.usersSubject$.value.length > 0) {
      return of(this.usersSubject$.value);
    }

    return this.api
      .get<User[]>(`${this.jsonUrl}/users`)
      .pipe(tap((users) => this.usersSubject$.next(users)));
  }

  createUser(user: User): Observable<User> {
    return this.api.post<User>(`${this.jsonUrl}/users`, user).pipe(
      tap((newUser: User) => {
        const mockUser = { ...newUser };
        const currentUsers = this.usersSubject$.value;
        this.usersSubject$.next([...currentUsers, mockUser]);
      }),
    );
  }

  updateUser(id: number, user: User): Observable<User> {
    const request$ =
      id > 10 ? of({ ...user, id }) : this.api.put<User>(`${this.jsonUrl}/users/${id}`, user);

    return request$.pipe(
      tap((updatedUser: User) => {
        const currentUsers = this.usersSubject$.value;
        const updatedList = currentUsers.map((u) => (u.id === id ? { ...u, ...updatedUser } : u));
        this.usersSubject$.next(updatedList);
      }),
    );
  }

  deleteUser(id: number): Observable<User> {
    const previousUsers = this.usersSubject$.value;
    const updatedUsers = previousUsers.filter((u) => u.id !== id);
    this.usersSubject$.next(updatedUsers);

    const request$ = id > 10 ? of({}) : this.api.delete<User>(`${this.jsonUrl}/users/${id}`);
    return request$.pipe(
      catchError((error) => {
        this.usersSubject$.next(previousUsers);
        return throwError(() => error);
      }),
    );
  }

  getUserById(id: number | string): Observable<User> {
    const userId = Number(id);
    const localUser = this.usersSubject$.value.find((u) => u.id === userId);
    if (localUser) {
      return of(localUser);
    }
    return this.api.get<User>(`${this.jsonUrl}/users/${userId}`);
  }

  searchUsers(query: string): Observable<User[]> {
    return this.api.get<User[]>(`${this.jsonUrl}/users`).pipe(
      map((users) =>
        users.filter(
          (u) =>
            u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase()),
        ),
      ),
      tap((filteredUsers) => this.usersSubject$.next(filteredUsers)),
    );
  }
}
