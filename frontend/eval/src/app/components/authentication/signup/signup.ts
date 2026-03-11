import { Component, inject } from '@angular/core';
import { Auth } from '../../../services/auth';
import { AuthUiWrapper } from '../auth-ui-wrapper/auth-ui-wrapper';
import { RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';
import { SignupService } from '../../../services/signup_service/signup-service';
// import { ChartNoAxesColumnDecreasing } from 'lucide-angular';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [AuthUiWrapper, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
})
export class Signup implements OnInit{
  authService = inject(Auth);
  signupService = inject(SignupService);

  ngOnInit(): void {
    this.authService.auth_page="SignUp"
  }
  signup(){
    if(this.authService.authForm.valid){
      this.authService.signupUser(this.authService.authForm.value)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }
}
