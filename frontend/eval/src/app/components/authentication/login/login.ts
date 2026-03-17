import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthUiWrapper } from '../auth-ui-wrapper/auth-ui-wrapper';
import { Auth } from '../../../services/auth';
import { RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';
import { LoginService } from '../../../services/login_service/login-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthUiWrapper, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnInit{
  platformID = inject(PLATFORM_ID)
  authService = inject(Auth)
  loginService = inject(LoginService)
  router = inject(Router)
  ngOnInit(): void {
    this.authService.auth_page="Login"
    if(isPlatformBrowser(this.platformID)){
      localStorage.setItem("current_auth_page", this.authService.auth_page)
    }

  }
  login(){
    if(this.authService.authForm.valid){
      // console.log(this.authService.authForm.value)
      console.log("This is the login email: ", )
      this.loginService.login(this.authService.authForm.value.email, this.authService.authForm.value.password)
      .then((res) => {
        if(res.error){
          console.log(res.error.message)
          alert("Login Failed!")
        }
        else{
          console.log(res.data)
          alert("Login Successful")
          // this.router.navigate(['/uploadResume'])  
        }
      })
    }
  }
}
