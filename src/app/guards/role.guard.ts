// src/app/core/role.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Dans role.guard.ts
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles: string[] = route.data['roles'];
  let userRole = authService.getUserRole();

  // Suppression du préfixe ROLE_ si présent
  userRole = userRole.replace(/^ROLE_/, '');

  console.log('User role (processed):', userRole);
  console.log('Expected roles:', expectedRoles);

  // Vérifier si le rôle de l'utilisateur est parmi les rôles attendus
  if (expectedRoles.includes(userRole)) {
    return true;
  } else {
    console.error(`Access denied: User role "${userRole}" not in expected roles:`, expectedRoles);
    router.navigate(['/unauthorized']);
    return false;
  }
};

