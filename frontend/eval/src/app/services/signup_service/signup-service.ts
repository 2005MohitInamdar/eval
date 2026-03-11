import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Inject } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class SignupService {
  http = inject(HttpClient)
  // private readonly API_URL = "http://127.0.0.1:8000/auth/signup";

  signupUser(userData:any){
    return this.http.post("http://127.0.0.1:8000/auth/signup", userData)
  }
  
  logOutUser(){
    return this.http.post("http://127.0.0.1:8000/logout", {})
  }
}
