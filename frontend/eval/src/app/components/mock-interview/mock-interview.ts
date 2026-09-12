import { Component,inject,  ChangeDetectorRef, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
interface MockInterviewResponse {
  status: string;
  question: string;
  audio_url: string;
  session_id?: string;
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
  private router = inject(Router)
  private authService = inject(Auth)

  first_question:string|null = ""
  user_answer = new FormControl("", [Validators.required])
  interview_type:string|null = "";
  session_id:string|null = ""
  interview_role:string|null = "";
  intensity_level:string|null = ""
  new_question = ""
  isSubmitting = false;



  isListening = false;
  isSpeechSupported = true;
  private recognition: any = null;
  private baseTextBeforeListening = ""; 


async ngOnInit() {
    if(isPlatformBrowser(this.platformid)){
      const audioUrl = localStorage.getItem("first_audio_url");
      this.first_question = localStorage.getItem("first_question") ?? ""
      this.interview_type = localStorage.getItem("interview_type") ?? ""
      this.interview_role = localStorage.getItem("interview_role") ?? ""
      this.intensity_level = localStorage.getItem("intensity_level")
      this.session_id = localStorage.getItem("interview_session_id")

      try {
        await this.authService.checkAuthStatus();
      } catch (err) {
        console.log("Not logged in:", err);
        this.router.navigate(['/auth/login']);
        return;
      }
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.load();
        audio.play().catch(err => console.log("Autoplay was blocked by browser:", err));
      }
      this.initSpeechRecognition();
    }
  }

  private initSpeechRecognition() {
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      this.isSpeechSupported = false;
      console.log("Speech Recognition not supported in this browser.");
      return;
    }

    this.recognition = new SpeechRecognitionCtor();
    this.recognition.continuous = true;      
    this.recognition.interimResults = true;  
    this.recognition.lang = "en-US";

    this.recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const combined = (this.baseTextBeforeListening + " " + finalTranscript + " " + interimTranscript).trim();
      this.user_answer.setValue(combined);
      this.cdr.detectChanges();

      if (finalTranscript) {
        this.baseTextBeforeListening = (this.baseTextBeforeListening + " " + finalTranscript).trim();
      }
    };

    this.recognition.onerror = (event: any) => {
      console.log("Speech recognition error:", event.error);
      this.isListening = false;
      this.cdr.detectChanges();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.cdr.detectChanges();
    };
  }

  toggleListening() {
    if (!this.recognition) return;

    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    } else {
      this.baseTextBeforeListening = this.user_answer.value ?? "";
      this.recognition.start();
      this.isListening = true;
    }
    this.cdr.detectChanges();
  }

  async submit(){

    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }

    if (!this.session_id || !this.first_question || !this.user_answer.value?.trim()) {
      alert('A session, question, and answer are required to continue.');
      return;
    }

    const payload = {
      "session_id": this.session_id,
      "first_question" : this.first_question,
      "answer": this.user_answer.value
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.user_answer.disable();   

    this.http.post<MockInterviewResponse>(`${environment.apiUrl}/next_qt`, payload, {withCredentials:true}).subscribe({
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
        this.first_question = res.question;
        this.user_answer.reset();
        this.isSubmitting = false;
        this.user_answer.enable();   

        if(isPlatformBrowser(this.platformid)){
          localStorage.setItem("first_question", this.new_question)
        }
        this.cdr.detectChanges();
      },
      error : (err) => {
        console.log(err);
        const message = err.error?.detail || err.message || "An unexpected error occurred";
        this.isSubmitting = false;
        this.user_answer.enable();  
        alert(message);
      }
    })
  }
}
