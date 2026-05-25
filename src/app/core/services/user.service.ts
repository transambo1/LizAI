import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { enviroment } from '../../../enviroments/enviroment';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  private usersSubject$ = new BehaviorSubject<any[]>([]);
  public users$ = this.usersSubject$.asObservable();

  getUsersFromServer(): Observable<any[]> {
    if (this.usersSubject$.value.length > 0) {
      return of(this.usersSubject$.value);
    }
    return this.http.get<any[]>(this.apiUrl).pipe(tap((data) => this.usersSubject$.next(data)));
  }

  createUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user).pipe(
      tap((newUser: any) => {
        const mockUser = { ...newUser };
        const currentUsers = this.usersSubject$.value;
        this.usersSubject$.next([...currentUsers, mockUser]);
      }),
    );
  }

  updateUser(id: number, user: any): Observable<any> {
    const request$ = id > 10 ? of({ ...user, id }) : this.http.put(`${this.apiUrl}/${id}`, user);

    return request$.pipe(
      tap((updatedUser: any) => {
        const currentUsers = this.usersSubject$.value;
        const updatedList = currentUsers.map((u) => (u.id === id ? { ...u, ...updatedUser } : u));
        this.usersSubject$.next(updatedList);
      }),
    );
  }

  deleteUser(id: number): Observable<any> {
    const previousUsers = this.usersSubject$.value;

    const updatedUsers = previousUsers.filter((u) => u.id !== id);
    this.usersSubject$.next(updatedUsers);

    const request$ = id > 10 ? of({}) : this.http.delete(`${this.apiUrl}/${id}`);
    return request$.pipe(
      catchError((error) => {
        this.usersSubject$.next(previousUsers);
        return throwError(() => error);
      }),
    );

    // tap(() => {
    //   const currentUsers = this.usersSubject$.value;
    //   this.usersSubject$.next(currentUsers.filter((u) => u.id !== id));
    // }),
  }

  getUserById(id: number | string): Observable<any> {
    const userId = Number(id);
    const localUser = this.usersSubject$.value.find((u) => u.id === userId);
    if (localUser) {
      return of(localUser);
    }
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`).pipe(
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

  private users = [
    {
      id: 'u001',
      name: 'Nguyen Van A',
      email: 'a.nguyen@example.com',
      role: 'Admin',
      status: 'Active',
      createdAt: '2025-01-10T08:30:00Z',
      lastLogin: '2026-05-01T09:00:00Z',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 'u002',
      name: 'Tran Thi B',
      email: 'b.tran@example.com',
      role: 'User',
      status: 'Inactive',
      createdAt: '2025-02-15T10:00:00Z',
      lastLogin: '2026-04-20T14:20:00Z',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: 'u003',
      name: 'Le Van C',
      email: 'c.le@example.com',
      role: 'Manager',
      status: 'Pending',
      createdAt: '2025-03-01T12:00:00Z',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    {
      id: 'u004',
      name: 'Pham Thi D',
      email: 'd.pham@example.com',
      role: 'User',
      status: 'Active',
      createdAt: '2025-04-05T09:15:00Z',
      lastLogin: '2026-05-03T11:45:00Z',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    {
      id: 'u005',
      name: 'Hoang Van E',
      email: 'e.hoang@example.com',
      role: 'Admin',
      status: 'Active',
      createdAt: '2025-05-12T07:20:00Z',
      lastLogin: '2026-05-02T08:10:00Z',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: 'u006',
      name: 'Vo Thi F',
      email: 'f.vo@example.com',
      role: 'User',
      status: 'Pending',
      createdAt: '2025-06-18T11:45:00Z',
      avatar: 'https://i.pravatar.cc/150?img=6',
    },
    {
      id: 'u007',
      name: 'Dang Van G',
      email: 'g.dang@example.com',
      role: 'Manager',
      status: 'Inactive',
      createdAt: '2025-07-22T14:30:00Z',
      lastLogin: '2026-04-28T16:00:00Z',
      avatar: 'https://i.pravatar.cc/150?img=7',
    },
    {
      id: 'u008',
      name: 'Bui Thi H',
      email: 'h.bui@example.com',
      role: 'User',
      status: 'Active',
      createdAt: '2025-08-10T09:10:00Z',
      lastLogin: '2026-05-04T10:25:00Z',
      avatar: 'https://i.pravatar.cc/150?img=8',
    },
    {
      id: 'u009',
      name: 'Do Van I',
      email: 'i.do@example.com',
      role: 'Manager',
      status: 'Active',
      createdAt: '2025-09-03T13:55:00Z',
      lastLogin: '2026-05-01T12:40:00Z',
      avatar: 'https://i.pravatar.cc/150?img=9',
    },
    {
      id: 'u010',
      name: 'Phan Thi K',
      email: 'k.phan@example.com',
      role: 'User',
      status: 'Inactive',
      createdAt: '2025-10-01T08:00:00Z',
      avatar: 'https://i.pravatar.cc/150?img=10',
    },
  ];
}
