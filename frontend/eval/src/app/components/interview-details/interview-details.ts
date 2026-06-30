import { Component,inject,  ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login_service/login-service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-interview-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './interview-details.html',
  styleUrl: './interview-details.scss',
})

export class InterviewDetails {
  private platformid = inject(PLATFORM_ID)
  private cdr = inject(ChangeDetectorRef)
  private router = inject(Router)
  displayed_text = ""
  interview_type:string = "";
  loggedUserID:string|null = ""
  interview_role = new FormControl("", [Validators.required]);
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
      "interview_role" : this.interview_role.value    
    }
    console.log(payload)  

    const response = await fetch("http://127.0.0.1:8000/mock_interview", {
      method: "POST",
      headers: {"content-Type": "application/json"},
      body: JSON.stringify(payload)
    })
      if(!response.body) return

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while(true){
        const {value, done} = await reader.read()
        if(done) break

        const chunk = decoder.decode(value, {stream:true})

        const cleaned_text = chunk.replace(/data: /g, "")

        this.displayed_text += cleaned_text
        console.log(this.displayed_text)

        this.cdr.detectChanges();
      }

      localStorage.setItem("first_question", this.displayed_text)
      this.router.navigate(['/MockInterview'])
  }
}
