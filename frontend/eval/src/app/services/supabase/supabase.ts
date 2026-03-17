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
    // console.log("Client initialized started")
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
    // console.log("Client initialized done -> ", this.supabase)


    //  this.supabase.auth.getSession().then(({ data: { session } }) => {
    //     console.log('🟡 getSession result:', session?.user ?? 'NO SESSION');
    //   this.currentUser.next(session?.user ?? null);
    // });


    this.supabase.auth.onAuthStateChange((event, session) => {
      // console.log('🟠 onAuthStateChange fired:', event, session?.user ?? 'NO USER');

      console.log("onAuthStateChange event fired: ", session?.user)
      if (session?.user) {
        this.currentUser.next(session?.user ?? null);
      } else {
        this.currentUser.next(null);
      }

      if (event === 'SIGNED_OUT') {
        this.router.navigate(['/auth/login']);
      }

      // Optional: Handle when a session is invalidated or expired
      if (event === 'USER_UPDATED' && !session) {
        this.router.navigate(['/auth/login']);
      }
      

    })

  }
    
}
