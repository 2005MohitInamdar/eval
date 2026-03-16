import { Injectable, inject } from '@angular/core';
import { Supabase } from '../supabase/supabase';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  supabaseService = inject(Supabase)

  login(loginEmail:string, loginPassword:string){
    return this.supabaseService.supabase.auth.signInWithPassword({
      "email": loginEmail,
      "password": loginPassword
    })
  }

  async loginWithGoogle(){
    const {error} = await this.supabaseService.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:4200/uploadResume'
        // redirectTo: window.location.origin
        
      },
    })
  }
}
