import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControlName, FormControl } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-auth-ui-wrapper',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-ui-wrapper.html',
  styleUrls: ['./auth-ui-wrapper.scss'],
})
export class AuthUiWrapper implements OnInit {
  authForm!:FormGroup
  private localStorage: Storage | undefined;

  auth_page:string = "Login"
  // login = "Login"
  // signUp = "SignUp"
  
  constructor(private fb:FormBuilder, @Inject(PLATFORM_ID) private platformId: Object){
    if(isPlatformBrowser(this.platformId)){
      this.localStorage = window.localStorage
    }
    this.initForm();
  }

  // switching signup/login pages start
  ngOnInit(): void{
    if(this.localStorage){
      const savedPage = localStorage.getItem("savedPage")
      if(savedPage){
        this.auth_page = savedPage
      }
    }

    if(this.auth_page === "Login"){
      this.authForm.removeControl("name")
    }else{
      this.authForm.addControl("name", new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]))
    }
  }
  

  // formGroup for login/signup
  initForm(){
    this.authForm = this.fb.group({
      name: [""],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    })
  }

  
  // page parameter is passed from html page
  setPage(page: string){

    this.auth_page = page 
    this.authForm.reset()
    if(this.localStorage){
      localStorage.setItem("savedPage", page)
    }


    if(this.auth_page === "Login"){
      this.authForm.removeControl("name")
    }else{
      this.authForm.addControl("name", new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)])  )
    }
  }
  // switching signup/login pages end
  


  // submitting the form
  submit(){
    if(this.authForm.valid){
      console.log(this.authForm.value)
    }else{
      this.authForm.markAllAsTouched()
    }
    
  }
}
