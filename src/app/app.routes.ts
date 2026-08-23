import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/enums';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register)
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'tickets' },
      {
        path: 'tickets',
        loadComponent: () => import('./features/tickets/ticket-list/ticket-list').then((m) => m.TicketList)
      },
      {
        path: 'tickets/new',
        loadComponent: () => import('./features/tickets/ticket-create/ticket-create').then((m) => m.TicketCreate)
      },
      {
        path: 'tickets/:id',
        loadComponent: () => import('./features/tickets/ticket-detail/ticket-detail').then((m) => m.TicketDetail)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard)
      },
      {
        path: 'admin/users',
        canActivate: [roleGuard],
        data: { roles: [UserRole.Admin] },
        loadComponent: () =>
          import('./features/admin/user-management/user-management').then((m) => m.UserManagement)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
