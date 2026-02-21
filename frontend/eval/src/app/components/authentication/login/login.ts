import { Component, inject } from '@angular/core';
import { AuthUiWrapper } from '../auth-ui-wrapper/auth-ui-wrapper';
import { Auth } from '../../../services/auth';
import { RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthUiWrapper, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit{
  authService = inject(Auth)

  ngOnInit(): void {
    this.authService.auth_page="Login"
  }
  login(){
    if(this.authService.authForm.valid){
      console.log(this.authService.authForm.value)
    }
  }
}
