import { Component,inject,  ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login_service/login-service';
@Component({
  selector: 'app-mock-interview',
  standalone: true, 
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './mock-interview.html',
  styleUrls: ['./mock-interview.scss'],
})
export class MockInterview {
  private loginService = inject(LoginService)
  private cdr = inject(ChangeDetectorRef)
  interview_type:string = "";
  displayed_text = ""
  interview_role = new FormControl("", [Validators.required]);
  interviewType(value:string){
    this.interview_type = value 
  }

  async start_interview(){
    const payload = {
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
      // console.log("This was the response: ", reader)
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
  }

   async currentUserSession(){
    const currentUser = await this.loginService.getCurrentUser()
    console.log("this is the current logged in user: ", currentUser);
  }
}
