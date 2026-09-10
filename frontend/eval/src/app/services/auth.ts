import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { inject, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class Auth {
  private localStorage: Storage | undefined;  
  private http = inject(HttpClient);
  
  authForm!:FormGroup;
  auth_page:string = "";
  currentUser: any = null;
  
  constructor(private fb:FormBuilder, @Inject(PLATFORM_ID) private platformId: Object){
    this.localStorageSSRError()
  }

    localStorageSSRError(){
      if(isPlatformBrowser(this.platformId)){
        this.localStorage = window.localStorage;
      }
      this.initForm();
    }


  handleNameController(){
    if(this.auth_page === "Login"){
      this.authForm.removeControl("name")
    }else{
      this.authForm.addControl("name", new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]))
    }
  }
  
  

  initForm(){
    this.authForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2), Validators.pattern("^[a-zA-Z-' ]+$")]], 
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    })
  }

  // checkAuthStatus() {
  //   return firstValueFrom(
  //     this.http.get(`${environment.apiUrl}/api/auth/me`, { withCredentials: true })
  //   );
  // }

  async checkAuthStatus() {
    try {
      const res: any = await firstValueFrom(
        this.http.get(`${environment.apiUrl}/api/auth/me`, { withCredentials: true })
      );
      this.currentUser = res.user;
      return res;
    } catch (err) {
      this.currentUser = null;
      throw err;
    }
  }


  // auth.ts
  async logout() {
    const res = await firstValueFrom(
      this.http.post(`${environment.apiUrl}/api/auth/logout`, {}, { withCredentials: true })
    );
    this.currentUser = null;
    return res;
  }
} 
