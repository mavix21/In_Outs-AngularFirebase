import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((r) => r.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((r) => r.DASHBOARD_ROUTES),
    canMatch: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
