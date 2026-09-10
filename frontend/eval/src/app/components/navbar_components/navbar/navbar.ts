import { Component, inject, signal, computed } from '@angular/core';
import { 
  LucideAngularModule, 
  LayoutDashboard, 
  ClipboardCheck, 
  CheckCircle2, 
  Clock3, 
  Bell, 
  FileText,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true, 
  imports: [LucideAngularModule, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar {

  private isHovered = signal(false);
  expanded = computed(() => this.isHovered());

  onMouseEnter() {
    this.isHovered.set(true);
  }

  onMouseLeave() {
    this.isHovered.set(false);
  }

  readonly DashboardIcon = LayoutDashboard;
  readonly ReportIcon = ClipboardCheck;
  readonly CompletedIcon = CheckCircle2;
  readonly RemainingIcon = Clock3;
  readonly NotificationIcon = Bell;
  readonly ResumeIcon = FileText;
  readonly ProfileIcon = User;
  readonly CollapseIcon = ChevronLeft;
  readonly ExpandIcon = ChevronRight;
} 
