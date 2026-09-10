import { Component, inject } from '@angular/core';
import { LucideAngularModule, User, Settings, LogOut, Menu,  } from 'lucide-angular';
import { SignupService } from '../../../services/signup_service/signup-service';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
@Component({
  selector: 'app-nav-top',
  standalone:true, 
  imports: [LucideAngularModule],
  templateUrl: './nav-top.html',
  styleUrls: ['./nav-top.scss'],
})
export class NavTop {
  private signupService = inject(SignupService)
  private authService = inject(Auth)
  
  private router = inject(Router)
  readonly ProfileIcon = User;
  readonly SettingsIcon = Settings;
  readonly LogoutIcon = LogOut;
  readonly MenuIcon = Menu;

  async logoutUser() {
    try {
      await this.authService.logout();
      this.authService.currentUser = null;
      this.router.navigate(['/auth/login']);
    } catch (err) {
      console.log("Logout failed:", err);
    }
  }
}
