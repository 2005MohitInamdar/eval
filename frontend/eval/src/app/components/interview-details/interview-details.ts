import { Component,inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
// import { LoginService } from '../../services/login_service/login-service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  
  displayed_text = ""
  interview_type:string = "";
  loggedUserID:string|null = ""
  interview_role = new FormControl("", [Validators.required]);
  intensity_level = new FormControl("", [Validators.required]);

  interviewType(value:string){
    this.interview_type = value 
  }

  async start_interview(){

    if(isPlatformBrowser(this.platformid)){
      this.loggedUserID = localStorage.getItem("userID")
    }
    const payload = {
      "loggedUserID" : this.loggedUserID,
      "interview_type" : this.interview_type,
      "interview_role" : this.interview_role.value,
      "intensity_level" : this.intensity_level.value
    }

    this.http.post("http://127.0.0.1:8000/mock_interview", payload, { responseType: 'text' }).subscribe({
      next: (res) => {
        console.log(res)
        this.displayed_text+=res

        localStorage.setItem("interview_type", this.interview_type)
        localStorage.setItem("interview_role", String(this.interview_role.value ?? "")) 
        localStorage.setItem("intensity_level", String(this.intensity_level.value ?? "")) 
        localStorage.setItem("first_question", this.displayed_text)
        
        this.router.navigate(['/MockInterview'])
        this.cdr.detectChanges()
      },
      error: (err) => {
        alert(err)
      }
    })
  }
}
