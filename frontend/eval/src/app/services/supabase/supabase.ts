import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class Supabase {
  public currentUser = new BehaviorSubject<any>(undefined) ;
  private router = inject(Router)
  supabase: SupabaseClient
  
  constructor(){
    this.supabase = createClient(
      environment.supabase.url, 
      environment.supabase.key,
      {
        auth: {
          persistSession: true,
          autoRefreshToken:true,
          detectSessionInUrl:true,
          flowType: 'pkce'
        }
      }
    )



    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log("onAuthStateChange event fired: ", session?.user)
      if (session?.user) {
        this.currentUser.next(session?.user ?? null);
      } else {
        this.currentUser.next(null);
      }
      if (event === 'SIGNED_OUT') {
        this.router.navigate(['/auth/login']);
      }
      if (event === 'USER_UPDATED' && !session) {
        this.router.navigate(['/auth/login']);
      }      
    })
  }
}
