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
      environment.supabase.SUPABASE_SERVICE_ROLE,
      {
        auth: {
          persistSession: false,
          autoRefreshToken:false,
          detectSessionInUrl:false,
          flowType: 'pkce'
        }
      }
    )
  }
}
