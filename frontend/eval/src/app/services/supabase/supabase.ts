import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Supabase {
  public currentUser = new BehaviorSubject<any>(null);

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
      if (session?.user) {
        this.currentUser.next(session.user);
      } else {
        this.currentUser.next(null);
      }
    })
  }  
}
