import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class Auth {
  authForm!:FormGroup;
  private localStorage: Storage | undefined;  
  auth_page:string = "Login";
  
  constructor(private fb:FormBuilder, @Inject(PLATFORM_ID) private platformId: Object){
    this.localStorageSSRError()
  }

    localStorageSSRError(){
      if(isPlatformBrowser(this.platformId)){
        this.localStorage = window.localStorage;
      }
      this.initForm();
    }

  //function for switching between signup/login pages 
  // loadPage(){
  //   if(this.localStorage){
  //     const savedPage = this.localStorage.getItem("savedPage")
  //     if(savedPage){
  //       this.auth_page = savedPage
  //     }
  //   }
  // }



  // function to handle name controller 
  handleNameController(){
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

  
  // gte current opened page
  // settingPage(page: string){
  //   this.auth_page = page 
  //   this.authForm.reset()
  //   if(this.localStorage){
  //     localStorage.setItem("savedPage", page)
  //   }
  // }

  // submit button
  submit(){
    if(this.authForm.valid){
      console.log(this.authForm.value)
    }else{
      this.authForm.markAllAsTouched()
    }  
  }
}
