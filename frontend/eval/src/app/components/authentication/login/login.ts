import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthUiWrapper } from '../auth-ui-wrapper/auth-ui-wrapper';
import { RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';
import { LoginService } from '../../../services/login_service/login-service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Auth } from '../../../services/auth';
interface LoginPayload {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthUiWrapper, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})



export class Login implements OnInit{
  private platformID = inject(PLATFORM_ID)
  authService = inject(Auth)
  private loginService = inject(LoginService)
  private http = inject(HttpClient)
  private router = inject(Router)

  errorMessage = signal<string | null>(null);
  isSubmitting = signal(false);

  constructor(){}
  
  ngOnInit(): void {
    this.authService.auth_page="Login"
    if(isPlatformBrowser(this.platformID)){
      localStorage.setItem("current_auth_page", this.authService.auth_page)
    }
  }

  loginWithGoogle() {
    this.loginService.loginWithGoogle();
  }

  loginUser(credentials: LoginPayload) {
    this.errorMessage.set(null);

    if (this.authService.authForm.invalid) {
      this.authService.authForm.markAllAsTouched();
      this.errorMessage.set('Enter a valid email address and password before logging in.');
      return;
    }

    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);

    return firstValueFrom(
      this.http.post(
        `${environment.apiUrl}/api/auth/login`,
        { login_email: credentials.email, login_password: credentials.password },
        { withCredentials: true } 
      )
    )
    .then((res) => {
      this.router.navigate(['/uploadResume']);
      
    })
    .catch((err) => {
      console.log("Login failed:", err);
      this.errorMessage.set(err?.error?.detail || "Login failed. Please try again.");
    })
    .finally(() => {
      this.isSubmitting.set(false);
    });
  }
}
