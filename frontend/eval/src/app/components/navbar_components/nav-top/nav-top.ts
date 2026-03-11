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
  signupService = inject(SignupService)
  readonly ProfileIcon = User;
  readonly SettingsIcon = Settings;
  readonly LogoutIcon = LogOut;

  logout(){
    this.signupService.signoutUser().
    then((res) => {
      console.log(res)
      alert("User logged out successfully!")
    })
    .catch((err) => {
      console.log(err)
    })
  }
}
