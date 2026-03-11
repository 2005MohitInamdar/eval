import { Injectable, inject } from '@angular/core';
import { Supabase } from '../supabase/supabase';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  supabaseService = inject(Supabase)

  login(){
    
  }
}
