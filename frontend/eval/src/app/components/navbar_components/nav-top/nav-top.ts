import { Component, inject } from '@angular/core';
import { LucideAngularModule, User, Settings, LogOut } from 'lucide-angular';
import { SignupService } from '../../../services/signup_service/signup-service';

@Component({
  selector: 'app-nav-top',
  standalone:true, 
  imports: [LucideAngularModule],
  templateUrl: './nav-top.html',
  styleUrls: ['./nav-top.scss'],
})
export class NavTop {
  
  readonly ProfileIcon = User;
  readonly SettingsIcon = Settings;
  readonly LogoutIcon = LogOut;

  signupService = inject(SignupService)
  logout(){
    this.signupService.logOutUser().subscribe({
      next:(response) => {
        console.log(response)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
