import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
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
  interview_type:string = "";
  interview_role = new FormControl("", [Validators.required]);
  interviewType(value:string){
    this.interview_type = value 
  }

  start_interview(){
    const payload = {
      "interview_type" : this.interview_type,
      "interview_role" : this.interview_role.value  
    }
    console.log(payload)  
    this.http.post("http://127.0.0.1:8000/mock_interview", payload).subscribe({
      next : (res) => {
        console.log(res)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
