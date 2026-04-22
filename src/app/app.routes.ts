import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'operaciones',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/operaciones/operaciones.component').then((m) => m.OperacionesComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent)
  },
  {
    path: 'presupuesto',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/presupuesto/presupuesto.component').then((m) => m.PresupuestoComponent)
  },
  {
    path: 'crear',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/crear-presupuesto/crear-presupuesto.component').then((m) => m.CrearPresupuestoComponent)
  },
  {
    path: 'administrar',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/administrar-presupuesto/administrar-presupuesto.component').then(
        (m) => m.AdministrarPresupuestoComponent
      )
  },
  {
    path: 'gasto',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/gasto/gasto.component').then((m) => m.GastoComponent)
  },
  {
    path: 'despedida',
    loadComponent: () =>
      import('./pages/despedida/despedida.component').then((m) => m.DespedidaComponent)
  },
  { path: '**', redirectTo: 'login' }
];