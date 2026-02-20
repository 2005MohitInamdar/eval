import { Routes } from '@angular/router';
import { Login } from './components/authentication/login/login';
import { Signup } from './components/authentication/signup/signup';
export const routes: Routes = [
    // {path: "", component: Home, title: "Tutorials page"},
    {path: 'signup', component: Signup, title: "Create account page"},
    {path: "login", component: Login, title: "Login page"}
];
