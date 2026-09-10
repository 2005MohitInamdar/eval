import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
@Component({
  selector: 'app-selection-page',
  standalone: true, 
  imports: [CommonModule, FormsModule],
  templateUrl: './selection-page.html',
  styleUrls: ['./selection-page.scss'],
})
export class SelectionPage {
  private http = inject(HttpClient)
  private authService = inject(Auth)
  private router = inject(Router)
  private platformid = inject(PLATFORM_ID)
  desired_company:string = ""
  desired_role:string = ""
  isSubmitting = false   // <-- add this

  get_resume_data(){
    return localStorage.getItem("resume_data")
  }

  async submit_desired_selection() {
    if (!isPlatformBrowser(this.platformid)) {
      return;
    }

    if (this.isSubmitting) return;
    if (!this.desired_company.trim() || !this.desired_role.trim()) {
      alert('Please provide both your desired company and role.');
      return;
    }

    this.isSubmitting = true 

    let currentUser;
    try {
      const res: any = await this.authService.checkAuthStatus();
      currentUser = res.user;
    } catch (err) {
      console.log("Not logged in:", err);
      this.router.navigate(['/auth/login']);
      this.isSubmitting = false 

      return;
    }

    const rawdata = this.get_resume_data();
    let resume_data: any = null;
    try {
      resume_data = rawdata ? JSON.parse(rawdata) : null;
    } catch {
      console.error('The saved resume data is invalid.');
    }

    if (!resume_data) {
      console.log("No resume data found");
      this.isSubmitting = false
      return;
    }


    const payload = {
      name: resume_data.name,
      email: resume_data.email,
      phone: resume_data.phone,
      location: resume_data.location,
      soft_skills: resume_data.soft_skills,
      technical_skills: resume_data.technical_skills,
      experience: resume_data.experience,
      projects: resume_data.projects,
      education: resume_data.education,
      linkedin_url: resume_data.linkedin_url,
      github_url: resume_data.github_url,
      portfolio_url: resume_data.portfolio_url,
      selected_company: this.desired_company.trim(),
      desired_role: this.desired_role.trim()
    };

    this.http.post(`${environment.apiUrl}/api/resume/save`, payload, { withCredentials: true }).subscribe({
      next: (res: any) => {
        console.log("Saved successfully:", res);

        localStorage.setItem("userID", currentUser.id);
        localStorage.removeItem("resume_data");
        localStorage.removeItem("desired_company");
        localStorage.removeItem("desired_role");

        this.router.navigate(['/ui_wrapper']);
        
        this.desired_company = "";
        this.desired_role = "";
      },
      error: (err) => {
        console.log("Error saving selection:", err);
        this.isSubmitting = false   
      }
    });
  }
}
