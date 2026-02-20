import { Component, signal } from '@angular/core';
import { AuthUiWrapper } from './components/authentication/auth-ui-wrapper/auth-ui-wrapper';
@Component({
  selector: 'app-root',
  imports: [AuthUiWrapper],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
}
