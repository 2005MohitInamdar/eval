import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Inject } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class SignupService {
  http = inject(HttpClient)
  private readonly API_URL = "http://127.0.0.1:8000/auth/signup";

  signupUser(userData:any){
    console.log("Request send to backend!")
    return this.http.post(this.API_URL, userData)
  }
  
}
