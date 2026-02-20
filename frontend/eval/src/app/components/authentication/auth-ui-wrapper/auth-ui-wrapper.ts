import { Component, inject, OnInit } from '@angular/core';
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
  
  constructor(private fb:FormBuilder){
  }

  // switching signup/login pages start
  ngOnInit(): void{
    // this.authService.loadPage()
    this.authService.handleNameController()
  }
  
  // page parameter is passed from html page
  // setPage(page: string){
  //   this.authService.settingPage(page)
  //   this.authService.handleNameController()
  // }
}
