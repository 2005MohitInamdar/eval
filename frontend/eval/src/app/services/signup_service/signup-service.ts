import { inject, Injectable } from '@angular/core';
import { Supabase } from '../supabase/supabase'; 

// import { Inject } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class SignupService {
  
  supabaseService = inject(Supabase)
  
  signupUser(userData:any){
    const userName = userData.name
    const email = userData.email
    const password = userData.password
      return this.supabaseService.supabase.auth.signUp(
        {
          email: email,
          password: password,
          options: {
            emailRedirectTo: 'http://localhost:4200/ui_wrapper',
            data: {
              name: userName
            }
          }
        }
      )
    } 

    signoutUser(){
      return this.supabaseService.supabase.auth.signOut()
    }
}
