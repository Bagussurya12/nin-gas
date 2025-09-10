// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { IsNotLoggedInGuard } from './guards/not-login/is-not-logged-in-guard';
import { IsLoggedInGuard } from './guards/login/is-logged-in-guard';

export const routes: Routes = [
  // Login route
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login').then((m) => m.LoginComponent),
  },

  // Main protected routes (prefix: /index)
  {
    path: 'gas',
    canActivate: [IsLoggedInGuard],
    children: [
      {
        path: 'index',
        loadChildren: () =>
          import('./pages/home/home.module').then((m) => m.HomeModule),
        data: { layout: 'app' },
        canActivate: [IsLoggedInGuard],
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./pages/home/home.module').then((m) => m.HomeModule),
        data: { layout: 'app' },
        canActivate: [IsLoggedInGuard],
      },
    ],
  },
  // User Management routes (prefix: /users)
  {
    path: 'gas/settings/users',
    canActivate: [IsLoggedInGuard],
    children: [
      {
        path: 'user-management',
        loadChildren: () =>
          import(
            './pages/settings/users/user-management/user-management.module'
          ).then((m) => m.UserManagementModule),
        canActivate: [IsLoggedInGuard],
        data: { layout: 'app' },
      },
      {
        path: 'user-management/create',
        loadChildren: () =>
          import(
            './pages/settings/users/user-management/create/create.module'
          ).then((m) => m.CreateModule),
        canActivate: [IsLoggedInGuard],
        data: { layout: 'app' },
      },
      {
        path: 'user-management/edit/:id',
        loadChildren: () =>
          import(
            './pages/settings/users/user-management/edit/edit.module'
          ).then((m) => m.EditModule),
        canActivate: [IsLoggedInGuard],
        data: { layout: 'app' },
      },
    ],
  },
  // ================ GUEST ================
  {
    path: 'gas/guest',
    canActivate: [IsLoggedInGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/Guest/guest/guest.module').then((m) => m.GuestModule),
        canActivate: [IsLoggedInGuard],
        data: { layout: 'app' },
      },
    ],
  },
  {
    path: 'gas/guest/create',
    canActivate: [IsLoggedInGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/Guest/guest/create/create.module').then(
            (m) => m.CreateModule
          ),
        canActivate: [IsLoggedInGuard],
        data: { layout: 'app' },
      },
    ],
  },
  {
    path: 'gas/guest/edit/:id',
    canActivate: [IsLoggedInGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/Guest/guest/edit/edit.module').then(
            (m) => m.EditModule
          ),
        canActivate: [IsLoggedInGuard],
        data: { layout: 'app' },
      },
    ],
  },

  // Catering
  {
    path: 'gas/catering/meal-ordering-system',
    canActivate: [IsLoggedInGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import(
            './pages/catering/meal-ordering-system/meal-ordering-system.module'
          ).then((m) => m.MealOrderingSystemModule),
        canActivate: [IsLoggedInGuard],
        data: { layout: 'app' },
      },
    ],
  },

  // Default route (redirect to login)
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // Not found route (wildcard)
  {
    path: '**',
    loadComponent: () =>
      import('./pages/auth/not-found/not-found').then(
        (m) => m.NotFoundComponent
      ),
  },
];
