import { Component,inject,  ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login_service/login-service';
import { isPlatformBrowser } from '@angular/common';
import { platform } from 'os';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-mock-interview',
  standalone: true, 
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './mock-interview.html',
  styleUrls: ['./mock-interview.scss'],
})
export class MockInterview {
  private http = inject(HttpClient)
  private cdr = inject(ChangeDetectorRef)
  private platformid = inject(PLATFORM_ID)
  first_question:string|null = ""
  user_answer = new FormControl("", [Validators.required])
  interview_type:string|null = "";
  loggedUserID:string|null = ""
  interview_role:string|null = "";
  new_question = ""



  constructor(){
    if(isPlatformBrowser(this.platformid)){
      this.first_question = localStorage.getItem("first_question") ?? ""
      this.interview_type = localStorage.getItem("interview_type") ?? ""
      this.interview_role = localStorage.getItem("interview_role") ?? ""
      this.loggedUserID = localStorage.getItem("loggedUserID") ?? ""

    }
    console.log(this.first_question)
  }

  async submit(){
    const payload = {
      "first_question" : this.first_question,
      "answer": this.user_answer.value,
      "interview_type": this.interview_type,
      "interview_role": this.interview_role,
      "loggedUserID": this.loggedUserID
    }


    this.new_question = "";       
    this.first_question = "";     
    this.user_answer.reset();     
    this.cdr.detectChanges();
    const response = await fetch("http://127.0.0.1:8000/next_qt", {
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

        this.new_question += cleaned_text
        console.log(this.new_question)

        this.cdr.detectChanges();
      }

      // this.first_question = ""
      if(isPlatformBrowser(this.platformid)){
        localStorage.setItem("first_question", this.new_question)
      }
  }
}
