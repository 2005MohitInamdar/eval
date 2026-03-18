import { Injectable, inject } from '@angular/core';
import { Supabase } from '../supabase/supabase';
@Injectable({
  providedIn: 'root',
})
export class UserResume {
  private supabaseService = inject(Supabase)

  async fileUpload(file:File){
  }
}
