import { Auth } from './auth';
import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { CanActivateFn, Router } from "@angular/router";

export const guestGuard: CanActivateFn = async (error) => {
const platformId = inject(PLATFORM_ID);
  const authService = inject(Auth);
  const router = inject(Router);

  // On the server, just let it pass — the real check happens in the browser
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  try {
    const res: any = await authService.checkAuthStatus();
    authService.currentUser = res.user;
    return router.createUrlTree(['/uploadResume']); // already logged in, redirect away
  } catch (e) {
    return true; // not logged in, fine to see login/signup
  }
}