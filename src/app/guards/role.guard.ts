// src/app/core/role.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Dans role.guard.ts
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles: string[] = route.data['roles'];
  const userRole = authService.getUserRole(); // Conserve ROLE_

  console.log('User role:', userRole);
  console.log('Expected roles:', expectedRoles);

  if (expectedRoles.includes(userRole)) {
    return true;
  } else {
    router.navigate(['/unauthorized']);
    return false;
  }
};
