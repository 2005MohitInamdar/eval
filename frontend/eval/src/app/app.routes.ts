import { Routes } from '@angular/router';
import { Login } from './components/authentication/login/login';
import { Signup } from './components/authentication/signup/signup';
import { SplashScreen } from './components/splash_screen/splash-screen/splash-screen';
import { Dashboard } from './components/interview_dashboard/dashboard/dashboard';
export const routes: Routes = [
    {path: "", component: SplashScreen, title: "Tutorials page"},
    {path: 'signup', component: Signup, title: "SignUp page"},
    {path: "login", component: Login, title: "Login page"},
    {path: "dashboard", component: Dashboard, title: "Interview Dashbord Page"}
];
