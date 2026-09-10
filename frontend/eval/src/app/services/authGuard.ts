import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(Auth);
  const router = inject(Router);

  // On the server, just let it pass — the real check happens in the browser
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  console.log("authGuard: starting check...");


  try {
    const res: any = await authService.checkAuthStatus();
    console.log("authGuard: checkAuthStatus succeeded:", res);

    authService.currentUser = res.user;
    return true;
  } catch (e) {
    console.log("authGuard: checkAuthStatus FAILED:", e);
    return router.createUrlTree(['/auth/login']);
  }
};