import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  
  fullName = 'Alex Johnson';
  email = 'alex.johnson@example.com';
  joinedOn = 'Joined September 2026';
 
  stats = [
    { label: 'Interviews Completed', value: 9 },
    { label: 'Average Score', value: '78%' },
    { label: 'Current Streak', value: '4 days' },
  ];
}
