import { inject, Injectable } from '@angular/core';
import { Supabase } from '../supabase/supabase'; 

// import { Inject } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class SignupService {
  
  supabaseService = inject(Supabase)
  
}
