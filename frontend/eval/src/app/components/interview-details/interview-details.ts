import { Component,inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../services/auth';
import { environment } from '../../../environments/environment.development';

interface MockInterviewResponse {
  status: string;
  question: string;
  audio_url: string;
  session_id: string;
}

@Component({
  selector: 'app-interview-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './interview-details.html',
  styleUrl: './interview-details.scss',
})

export class InterviewDetails {
  private http = inject(HttpClient)
  private platformid = inject(PLATFORM_ID)
  private cdr = inject(ChangeDetectorRef)
  private router = inject(Router)
  private authService = inject(Auth)
  
  displayed_text = ""
  interview_type:string = "";
  interview_role = new FormControl("", [Validators.required]);
  intensity_level = new FormControl("", [Validators.required]);

  interviewType(value:string){
    this.interview_type = value 
  }

  async start_interview(){
    console.log("interview component navigated!")

    try {
      await this.authService.checkAuthStatus();
    } catch (err) {
      console.log("Not logged in:", err);
      this.router.navigate(['/auth/login']);
      return;
    }

    if (!this.interview_type || this.interview_role.invalid || this.intensity_level.invalid) {
      this.interview_role.markAsTouched();
      this.intensity_level.markAsTouched();
      return;
    }

    const payload = {
      "interview_type" : this.interview_type,
      "interview_role" : this.interview_role.value,
      "intensity_level" : this.intensity_level.value
    }
    
    this.http.post<MockInterviewResponse>(`${environment.apiUrl}/mock_interview`, payload, {withCredentials:true}).subscribe({
      next: (res) => {
        console.log("audio url generated successfully: ", res.audio_url)

        this.displayed_text = res.question

        localStorage.setItem("interview_type", this.interview_type)
        localStorage.setItem("interview_role", String(this.interview_role.value ?? "")) 
        localStorage.setItem("intensity_level", String(this.intensity_level.value ?? "")) 
        localStorage.setItem("first_question", this.displayed_text)
        localStorage.setItem("first_audio_url", res.audio_url);
        localStorage.setItem("interview_session_id", res.session_id);

        this.router.navigate(['/MockInterview'])
        this.cdr.detectChanges()
      },
      error: (err) => {
        console.log(err); // keep this for full debugging detail in the console
        const message = err.error?.detail || err.message || "An unexpected error occurred";
        console.log("error message: " , message);
      }
    })
  }
}
