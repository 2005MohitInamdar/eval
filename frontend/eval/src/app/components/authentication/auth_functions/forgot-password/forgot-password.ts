import { Component } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true, 
  imports: [],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
})
export class ForgotPassword {
  next(){
    console.log("Hello World!")
  }
}
