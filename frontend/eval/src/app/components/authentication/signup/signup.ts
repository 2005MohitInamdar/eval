import { Component, inject } from '@angular/core';
import { Auth } from '../../../services/auth';
import { AuthUiWrapper } from '../auth-ui-wrapper/auth-ui-wrapper';
import { RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [AuthUiWrapper, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup implements OnInit{
  authService = inject(Auth)

  ngOnInit(): void {
    this.authService.auth_page="SignUp"
  }
  signup(){
    if(this.authService.authForm.valid){
      console.log(this.authService.authForm.value)
    }
  }
}
