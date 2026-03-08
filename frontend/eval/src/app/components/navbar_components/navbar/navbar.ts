import { Component } from '@angular/core';
import { 
  LucideAngularModule, 
  LayoutDashboard, 
  ClipboardCheck, 
  CheckCircle2, 
  Clock3, 
  Bell, 
  FileText,
  User
} from 'lucide-angular';

import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true, 
  imports: [LucideAngularModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar {
    readonly DashboardIcon = LayoutDashboard;
    readonly ReportIcon = ClipboardCheck;
    readonly CompletedIcon = CheckCircle2;
    readonly RemainingIcon = Clock3;
    readonly NotificationIcon = Bell;
    readonly ResumeIcon = FileText;
    readonly ProfileIcon = User;
} 
