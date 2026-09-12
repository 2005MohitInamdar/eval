import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(Auth);
  const router = inject(Router);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  try {
    const res: any = await authService.checkAuthStatus();

    authService.currentUser = res.user;
    return true;
  } catch (e) {
    return router.createUrlTree(['/auth/login']);
  }
};