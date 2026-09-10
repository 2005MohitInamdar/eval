import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Auth } from '../../../services/auth';
import { AuthUiWrapper } from '../auth-ui-wrapper/auth-ui-wrapper';
import { RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';
import { SignupService } from '../../../services/signup_service/signup-service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [AuthUiWrapper, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
})
export class Signup implements OnInit {
  private platformID = inject(PLATFORM_ID)
  private router = inject(Router)
  private http = inject(HttpClient)
  authService = inject(Auth);
  signupService = inject(SignupService);

  errorMessage = signal<string | null>(null);
  isSubmitting = signal(false);

  ngOnInit(): void {
    this.authService.auth_page = "SignUp"
    if (isPlatformBrowser(this.platformID)) {
      localStorage.setItem("current_auth_page", this.authService.auth_page)
    }
  }

  signup() {
    this.errorMessage.set(null);

    if (this.authService.authForm.invalid) {
      this.authService.authForm.markAllAsTouched();
      this.errorMessage.set("Please fix the highlighted fields before continuing.");
      return;
    }

    const userName = this.authService.authForm.value.name
    const email = this.authService.authForm.value.email
    const password = this.authService.authForm.value.password

    this.isSubmitting.set(true);

    return firstValueFrom(
      this.http.post(
        `${environment.apiUrl}/api/auth/signupUser`,
        { name: userName, email, password }
      )
    )
      .then(() => {
        this.router.navigate(['/auth/verify_email']);
      })
      .catch((err) => {
        this.errorMessage.set(err?.error?.detail || "Signup failed. Please try again.");
      })
      .finally(() => {
        this.isSubmitting.set(false);
      });
  }
}