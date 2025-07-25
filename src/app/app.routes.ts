import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/accueil/accueil.component').then(m => m.AccueilComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard-dg',
    loadComponent: () => import('./pages/dashboard-dg/dashboard-dg.component').then(m => m.DashboardDgComponent),
    canActivate: [authGuard],
    data: { roles: ['Directeur_General'] }
  },
  {
    path: 'dashboard-departement',
    loadComponent: () => import('./pages/dashboard-departement/dashboard-departement.component').then(m => m.DashboardDepartementComponent),
    canActivate: [authGuard],
    data: { roles: ['Chef_Departement'] }, // Retiré le préfixe ROLE_
    children: [
      {
        path: 'absences',
        loadComponent: () =>
          import('./pages/dashboard-departement/absences/absences.component').then(
            (m) => m.AbsenceComponent
          ),
      },
      {
        path: 'conges',
        loadComponent: () =>
          import('./pages/dashboard-departement/conges/conges.component').then(
            (m) => m.CongesComponent
          ),
      },
      {
        path: 'paiements',
        loadComponent: () =>
          import('./pages/dashboard-departement/paiements/paiements.component').then(
            (m) => m.PaiementsComponent
          ),
      },
      {
        path: 'questionnaires',
        loadComponent: () =>
          import('./pages/dashboard-departement/questionnaires/questionnaires.component').then(
            (m) => m.QuestionnairesComponent
          ),
      },
      { path: '', redirectTo: 'absences', pathMatch: 'full' },
    ],
  },
  {
    path: 'dashboard-service',
    loadComponent: () => import('./pages/dashboard-service/dashboard-service.component').then(m => m.DashboardServiceComponent),
    canActivate: [authGuard],
    data: { roles: ['Chef_Service'] }
  },
  {
    path: 'dashboard-employe',
    loadComponent: () => import('./pages/dashboard-employe/dashboard-employe.component').then(m => m.DashboardEmployeComponent),
    canActivate: [authGuard],
    data: { roles: ['EMPLOYE'] }
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    redirectTo: 'unauthorized'
  }
];
