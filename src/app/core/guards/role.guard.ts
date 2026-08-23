import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/enums';

/** Route data must include `roles: UserRole[]`. Combine with authGuard in the route config. */
export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as UserRole[] | undefined;
  const currentRole = authService.role();

  if (!allowedRoles || (currentRole && allowedRoles.includes(currentRole))) {
    return true;
  }

  return router.createUrlTree(['/tickets']);
};
