import { Injectable, inject } from '@angular/core';
import { Supabase } from '../supabase/supabase';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  supabaseService = inject(Supabase)

  async loginWithGoogle() {
    const { data, error } = await this.supabaseService.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:4200/auth/wait'
      }
    });
    // if (error) {
    //   console.log("Google sign-in failed:", error.message);
    // }
  }
}
