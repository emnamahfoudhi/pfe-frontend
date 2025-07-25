import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Vérifier si l'utilisateur est authentifié
  if (!authService.isAuthenticated()) {
    console.log('User not authenticated, redirecting to login');
    router.navigate(['/login']);
    return false;
  }

  // Vérifier les rôles si spécifiés
  const expectedRoles = route.data?.['roles'] as string[];
  if (expectedRoles && expectedRoles.length > 0) {
    const hasRequiredRole = authService.hasAnyRole(expectedRoles);

    if (!hasRequiredRole) {
      console.log('User does not have required role, redirecting to unauthorized');
      router.navigate(['/unauthorized']);
      return false;
    }
  }

  return true;
};
