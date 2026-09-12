import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface InterviewEvaluation {
  role: string;
  type: string;
  score: number;     
  date: string;
  questionsAnswered: number;
}

@Component({
  selector: 'app-evaluation-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evaluation-report.html',
  styleUrl: './evaluation-report.scss',
})

export class EvaluationReport {
  totalInterviews = 6;
  overallScore = 76;
 
  evaluations: InterviewEvaluation[] = [
    { role: 'Backend Developer', type: 'Technical', score: 82, date: 'Sep 8, 2026', questionsAnswered: 8 },
    { role: 'AI Engineer', type: 'Technical', score: 74, date: 'Sep 6, 2026', questionsAnswered: 7 },
    { role: 'Frontend Developer', type: 'Combined', score: 88, date: 'Sep 3, 2026', questionsAnswered: 9 },
    { role: 'Product Manager', type: 'Behavioral', score: 69, date: 'Aug 29, 2026', questionsAnswered: 6 },
    { role: 'Data Analyst', type: 'Technical', score: 79, date: 'Aug 24, 2026', questionsAnswered: 8 },
    { role: 'DevOps Engineer', type: 'Combined', score: 71, date: 'Aug 20, 2026', questionsAnswered: 7 },
  ];
 
  scoreTone(score: number): 'good' | 'mid' | 'low' {
    if (score >= 80) return 'good';
    if (score >= 65) return 'mid';
    return 'low';
  }
}
