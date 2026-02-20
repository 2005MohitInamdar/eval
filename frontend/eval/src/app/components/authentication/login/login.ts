import { Component, inject } from '@angular/core';
import { AuthUiWrapper } from '../auth-ui-wrapper/auth-ui-wrapper';
import { Auth } from '../../../services/auth';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthUiWrapper, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  authService = inject(Auth)
  login(){
    if(this.authService.authForm.valid){
      console.log(this.authService.authForm.value)
    }
  }
}
