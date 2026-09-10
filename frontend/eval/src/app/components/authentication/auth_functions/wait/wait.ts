import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-wait',
  standalone: true,
  imports: [],
  templateUrl: './wait.html',
  styleUrls: ['./wait.scss'],
})
export class Wait implements OnInit {
  private platformID = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private router = inject(Router);

  async ngOnInit() {
    if (!isPlatformBrowser(this.platformID)) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      console.log("No code found in callback URL");
      this.router.navigate(['/auth/login']);
      return;
    }

    try {
      await firstValueFrom(
        this.http.post(
          "http://localhost:8000/api/auth/oauth/callback",
          { code },
          { withCredentials: true }
        )
      );
      this.router.navigate(['/uploadResume']);
    } catch (err) {
      console.log("OAuth callback failed:", err);
      this.router.navigate(['/auth/login']);
    }
  }
}
