import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../../services/auth';
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
  current_page!:string | null

  
  constructor(private fb:FormBuilder){
  }

  ngOnInit(): void{
    this.authService.initForm()
    this.authService.handleNameController()
    if(isPlatformBrowser(this.platformID)){
      this.current_page = localStorage.getItem("current_auth_page")
    }
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
}
