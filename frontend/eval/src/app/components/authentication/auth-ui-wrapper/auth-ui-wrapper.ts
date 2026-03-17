import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../../services/auth';
import { LoginService } from '../../../services/login_service/login-service';
import { Supabase } from '../../../services/supabase/supabase';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
@Component({
  selector: 'app-auth-ui-wrapper',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth-ui-wrapper.html',
  styleUrls: ['./auth-ui-wrapper.scss'],
})
export class AuthUiWrapper implements OnInit {
  authForm!:FormGroup;
  authService = inject(Auth);
  private platformID = inject(PLATFORM_ID)
  loginService = inject(LoginService)
  current_page!:string | null
  supabaseService = inject(Supabase)
  router = inject(Router)
    // private localStorage: Storage | undefined;  

  
  constructor(private fb:FormBuilder){
  }

  // switching signup/login pages start
  ngOnInit(): void{
    this.authService.initForm()
    this.authService.handleNameController()
    if(isPlatformBrowser(this.platformID)){
      this.current_page = localStorage.getItem("current_auth_page")
    }
    this.supabaseService.currentUser
    .pipe(filter(user => user !== undefined))
    .subscribe(user => {
      
      if (user) {
        // If we find a user, get them off the login page
        this.router.navigate(['/uploadResume']);
      }
    });
  }
  
  auth_form = this.authService.authForm

  get name(){
    return this.authService.authForm.get('name')
  }
  get email(){
    return this.authService.authForm.get('email');
  }
  get password(){
    return this.authService.authForm.get('password')
  }

  async SignInWIthGoogle(){
    try{
      await this.loginService.loginWithGoogle()
    }
    catch(err){
      console.log("SIgn In with Google failed", err)
      alert("Failed to login with google")
    }
    console.log("Button for google signin clicked!")
  }

  // page parameter is passed from html page
  // setPage(page: string){
  //   this.authService.settingPage(page)
  //   this.authService.handleNameController()
  // }
}
