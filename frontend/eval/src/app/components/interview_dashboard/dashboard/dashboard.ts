// import { Component, inject } from '@angular/core';
// import { Router } from '@angular/router';
// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [],
//   templateUrl: './dashboard.html',
//   styleUrls: ['./dashboard.scss'],
// })
// export class Dashboard {
//   private router = inject(Router)

//   mockInterview(){
//     this.router.navigate(['/interviewDetails']);
//   }
// }







import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface RoleScore {
  role: string;
  score: number; // 0-100
}

interface RoleCount {
  role: string;
  count: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  private router = inject(Router);

  // ---- Placeholder stats — swap with real API data later ----
  totalInterviews = 12;
  completedInterviews = 9;
  remainingInterviews = 3;
  averageScore = 78;

  // ---- Score by role (horizontal bar chart) ----
  roleScores: RoleScore[] = [
    { role: 'Frontend Developer', score: 82 },
    { role: 'Backend Developer', score: 75 },
    { role: 'Data Analyst', score: 88 },
    { role: 'Product Manager', score: 69 },
  ];

  // ---- Completion donut (2-segment conic-gradient) ----
  completionGradient = '';

  // ---- Role distribution donut (multi-segment conic-gradient) ----
  roleDistribution: RoleCount[] = [
    { role: 'Frontend Developer', count: 4, color: '#F97316' }, // orange-500
    { role: 'Backend Developer', count: 3, color: '#1D4ED8' },  // blue-700
    { role: 'Data Analyst', count: 2, color: '#3B82F6' },       // blue-500
    { role: 'Product Manager', count: 3, color: '#CBD5E1' },    // slate-300
  ];
  roleDistributionGradient = '';

  // ---- Score trend (SVG line chart) ----
  scoreTrend: number[] = [62, 68, 71, 75, 74, 78, 82];
  trendPoints = '';
  trendAreaPoints = '';

  ngOnInit() {
    this.buildCompletionGradient();
    this.buildRoleDistributionGradient();
    this.buildTrendPoints();
  }

  private buildCompletionGradient() {
    const pct = Math.round((this.completedInterviews / this.totalInterviews) * 100);
    this.completionGradient = `conic-gradient(#F97316 0% ${pct}%, #E2E8F0 ${pct}% 100%)`;
  }

  private buildRoleDistributionGradient() {
    const total = this.roleDistribution.reduce((sum, r) => sum + r.count, 0);
    let cursor = 0;
    const stops: string[] = [];
    for (const r of this.roleDistribution) {
      const start = (cursor / total) * 100;
      cursor += r.count;
      const end = (cursor / total) * 100;
      stops.push(`${r.color} ${start}% ${end}%`);
    }
    this.roleDistributionGradient = `conic-gradient(${stops.join(', ')})`;
  }

  private buildTrendPoints() {
    const w = 300;
    const h = 100;
    const step = w / (this.scoreTrend.length - 1);

    const coords = this.scoreTrend.map((val, i) => {
      const x = i * step;
      const y = h - (val / 100) * h;
      return `${x},${y}`;
    });

    this.trendPoints = coords.join(' ');
    this.trendAreaPoints = `0,${h} ${coords.join(' ')} ${w},${h}`;
  }

  mockInterview() {
    this.router.navigate(['/interviewDetails']);
  }
}