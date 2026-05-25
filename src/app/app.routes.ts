import { Routes } from '@angular/router';
import { MainLayout } from './core/layout/main-layout/main-layout.component'; // Layout dùng chung có thể import trực tiếp
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  // CỤM ROUTE CHO AUTH (LAZY LOADING)
  {
    path: 'auth',
    canActivate: [publicGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => 
          import('./features/auth/login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => 
          import('./features/auth/register/register.component').then(m => m.RegisterComponent),
      },
    ],
  },

  // CỤM ROUTE CHO ADMIN (LAZY LOADING CHI TIẾT)
  {
    path: 'admin',
    canActivate: [authGuard],
    component: MainLayout,
    children: [
      {
        path: 'users',
        loadComponent: () => 
          import('./features/user-management/user-list/user-list.component').then(m => m.UserListComponent),
      },
      {
        path: 'users/:id',
        loadComponent: () => 
          import('./features/user-management/user-detail/user-detail.component').then(m => m.UserDetailComponent),
      },
    ],
  },

  // CỤM ROUTE CHO USER OVERVIEW
  {
    path: 'user',
    canActivate: [authGuard],
    loadComponent: () => 
      import('./features/user-management/user-overview/user-overview.component').then(m => m.UserOverviewComponent),
  },

  // REDIRECT & WILDCARD
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' },
];