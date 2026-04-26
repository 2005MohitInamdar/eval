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
    console.log("Login with google: ")
    const {data, error} = await this.supabaseService.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:4200/uploadResume'
        // redirectTo: window.location.origin
        
      },
    })
  }

   async getCurrentUser(){
    const {data: {user}} = await this.supabaseService.supabase.auth.getUser()
    return user
  }
}
