import { Component,inject,  ChangeDetectorRef, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login_service/login-service';
import { HttpClient } from '@angular/common/http';
interface MockInterviewResponse {
  status: string;
  question: string;
  audio_url: string;
}

@Component({
  selector: 'app-mock-interview',
  standalone: true, 
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './mock-interview.html',
  styleUrls: ['./mock-interview.scss'],
})
export class MockInterview implements OnInit{
  private http = inject(HttpClient)
  private cdr = inject(ChangeDetectorRef)
  private platformid = inject(PLATFORM_ID)

  first_question:string|null = ""
  user_answer = new FormControl("", [Validators.required])
  interview_type:string|null = "";
  loggedUserID:string|null = ""
  interview_role:string|null = "";
  intensity_level:string|null = ""
  new_question = ""


  ngOnInit() {
    if(isPlatformBrowser(this.platformid)){
      const audioUrl = localStorage.getItem("first_audio_url");
      this.first_question = localStorage.getItem("first_question") ?? ""
      this.interview_type = localStorage.getItem("interview_type") ?? ""
      this.interview_role = localStorage.getItem("interview_role") ?? ""
      this.intensity_level = localStorage.getItem("intensity_level")
      this.loggedUserID = localStorage.getItem("loggedUserID") ?? ""
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.load();
        audio.play().catch(err => console.log("Autoplay was blocked by browser:", err));
      }
      
    }
  }

  async submit(){
    const payload = {
      "first_question" : this.first_question,
      "answer": this.user_answer.value,
      "interview_type": this.interview_type,
      "interview_role": this.interview_role,
      "loggedUserID": this.loggedUserID,
      "intensity_level" : this.intensity_level
    }


    this.new_question = "";       
    this.first_question = "";     
    this.user_answer.reset();     
    this.cdr.detectChanges();

    this.http.post<MockInterviewResponse>("http://127.0.0.1:8000/next_qt", payload).subscribe({
      next: (res) => {
        console.log(res.audio_url)
        if (res.audio_url) {
          if(isPlatformBrowser(this.platformid)){
            localStorage.setItem("first_audio_url", res.audio_url)
          }
          const audio = new Audio(res.audio_url);
          audio.load();
          audio.play().catch(err => console.log("Audio playback blocked or failed:", err));
        }
        this.new_question = res.question
        
        if(isPlatformBrowser(this.platformid)){
          localStorage.setItem("first_question", this.new_question)

        }
        this.cdr.detectChanges();
      },
      error : (err) => {
        console.log(err)
      }
    })
  }
}
