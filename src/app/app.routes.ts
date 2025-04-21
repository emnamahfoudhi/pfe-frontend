import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './core/auth.guard';

export const appRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/accueil/accueil.component').then(m => m.AccueilComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'dashboard-dg', loadComponent: () => import('./pages/dashboard-dg/dashboard-dg.component').then(m => m.DashboardDgComponent) },
  { path: 'dashboard-departement', loadComponent: () => import('./pages/dashboard-departement/dashboard-departement.component').then(m => m.DashboardDepartementComponent) },
  { path: 'dashboard-service', loadComponent: () => import('./pages/dashboard-service/dashboard-service.component').then(m => m.DashboardServiceComponent) },
  { path: 'dashboard-employe', loadComponent: () => import('./pages/dashboard-employe/dashboard-employe.component').then(m => m.DashboardEmployeComponent) },
  { path: 'unauthorized', loadComponent: () => import('./pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) },
];
