import { Routes } from '@angular/router';
import { Login } from './components/authentication/login/login';
import { Signup } from './components/authentication/signup/signup';
import { SplashScreen } from './components/splash_screen/splash-screen/splash-screen';
import { Dashboard } from './components/interview_dashboard/dashboard/dashboard';
import { UpdatePassword } from './components/authentication/auth_functions/update-password/update-password'; 
import { VerifyEmail } from './components/authentication/signup/verify-email/verify-email'; 
import { ForgotPassword } from './components/authentication/auth_functions/forgot-password/forgot-password'; 
export const routes: Routes = [
    {path: "", component: SplashScreen, title: "Tutorials page"},
    {path: 'auth/signup', component: Signup, title: "SignUp page"},
    {path: "auth/login", component: Login, title: "Login page"},
    {path: "auth/verify_email", component: VerifyEmail, title: "Email Verification page"},
    {path: "auth/update_password", component: UpdatePassword, title: "Update Password page"},
    {path: "auth/forgot_password", component: ForgotPassword, title: "Forgot Password page"},
    {path: "dashboard", component: Dashboard, title: "Interview Dashbord Page"}
];
