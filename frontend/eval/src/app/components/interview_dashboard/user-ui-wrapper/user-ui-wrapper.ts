import { Component } from '@angular/core';
import { Navbar } from '../../navbar_components/navbar/navbar'; 
import { RouterOutlet } from '@angular/router';
import { NavTop } from '../../navbar_components/nav-top/nav-top';

@Component({
  selector: 'app-user-ui-wrapper',
  standalone: true,
  imports: [ RouterOutlet, Navbar, NavTop],
  templateUrl: './user-ui-wrapper.html',
  styleUrl: './user-ui-wrapper.scss',
})
export class UserUiWrapper {

}
