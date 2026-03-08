import { Component } from '@angular/core';
import { LucideAngularModule, User, Settings, LogOut } from 'lucide-angular';@Component({
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
}
