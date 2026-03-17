import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom, filter, timeout, catchError, of } from 'rxjs';
import { Supabase } from './supabase/supabase';

export const authGuard: CanActivateFn = async (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const supabaseService = inject(Supabase);
  const router = inject(Router);

  // If we are on the server, just let it pass (the real check happens in the browser)
  if (!isPlatformBrowser(platformId)) {
    return true; 
  }

  // try {
  //   // Now it is safe to use window-related logic or async auth checks
  //   const user = await firstValueFrom(
  //     supabaseService.currentUser.pipe(
  //       filter(val => val !== undefined),
  //       timeout(5000),
  //       catchError(() => of(null))
  //     )
  //   );

  //   if (user) return true;

  //   // Check for PKCE code in the URL safely
  //   if (window.location.search.includes('code=')) {
  //       return true; 
  //   }

  //   return router.createUrlTree(['/auth/login']);
  // } catch (e) {
  //   return router.createUrlTree(['/auth/login']);
  // }

  try {
  // 1. Ask Supabase directly: "Do we have a valid session in storage RIGHT NOW?"
  const { data: { session } } = await supabaseService.supabase.auth.getSession();

  if (session?.user) {
    return true; 
  }

  // 2. If no session, check for the PKCE code
  if (window.location.search.includes('code=')) {
    return true; 
  }

  // 3. No session, no code = GET OUT
  return router.createUrlTree(['/auth/login']);
  } catch (e) {
    return router.createUrlTree(['/auth/login']);
  }
};