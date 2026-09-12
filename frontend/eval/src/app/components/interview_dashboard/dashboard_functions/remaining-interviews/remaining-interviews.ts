import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RemainingInterview {
  role: string;
  type: string;
  progress: number;
  questionsLeft: number;
  startedOn: string;
}


@Component({
  selector: 'app-remaining-interviews',
  imports: [CommonModule, FormsModule],
  templateUrl: './remaining-interviews.html',
  styleUrl: './remaining-interviews.scss',
})
export class RemainingInterviews {
  
  searchQuery = '';
 
  interviews: RemainingInterview[] = [
    { role: 'Backend Development', type: 'Technical', progress: 60, questionsLeft: 3, startedOn: 'Sep 10, 2026' },
    { role: 'AI Engineer', type: 'Combined', progress: 30, questionsLeft: 6, startedOn: 'Sep 9, 2026' },
    { role: 'Frontend Developer', type: 'Behavioral', progress: 80, questionsLeft: 1, startedOn: 'Sep 7, 2026' },
    { role: 'Product Manager', type: 'Behavioral', progress: 40, questionsLeft: 4, startedOn: 'Sep 5, 2026' },
    { role: 'Data Analyst', type: 'Technical', progress: 50, questionsLeft: 4, startedOn: 'Sep 2, 2026' },
    { role: 'DevOps Engineer', type: 'Combined', progress: 20, questionsLeft: 6, startedOn: 'Aug 28, 2026' },
  ];
 
  get filteredInterviews(): RemainingInterview[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return this.interviews;
    return this.interviews.filter(interview =>
      interview.role.toLowerCase().includes(query)
    );
  }
}