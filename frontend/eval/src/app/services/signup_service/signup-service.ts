import { inject, Injectable } from '@angular/core';
import { Supabase } from '../supabase/supabase'; 

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  
  supabaseService = inject(Supabase)
  
}
