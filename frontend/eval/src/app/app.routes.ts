import { Routes } from '@angular/router';
import { Login } from './components/authentication/login/login';
import { Signup } from './components/authentication/signup/signup';
import { SplashScreen } from './components/splash_screen/splash-screen/splash-screen';
import { Dashboard } from './components/interview_dashboard/dashboard/dashboard';
import { UpdatePassword } from './components/authentication/auth_functions/update-password/update-password'; 
import { VerifyEmail } from './components/authentication/auth_functions/verify-email/verify-email'; 
import { ForgotPassword } from './components/authentication/auth_functions/forgot-password/forgot-password'; 
import { UserUiWrapper } from './components/interview_dashboard/user-ui-wrapper/user-ui-wrapper';
import { EvaluationReport } from './components/interview_dashboard/dashboard_functions/evaluation-report/evaluation-report';
import { CompletedInterviews } from './components/interview_dashboard/dashboard_functions/completed-interviews/completed-interviews';
import { RemainingInterviews } from './components/interview_dashboard/dashboard_functions/remaining-interviews/remaining-interviews';
import { Notifications } from './components/interview_dashboard/dashboard_functions/notifications/notifications';
import { Resume } from './components/interview_dashboard/dashboard_functions/resume/resume';
import { Profile } from './components/interview_dashboard/dashboard_functions/profile/profile';
import { UploadResume } from './components/user_Onboarding/upload-resume/upload-resume';
import { ConfirmResume } from './components/user_Onboarding/confirm-resume/confirm-resume';
import { SelectionPage } from './components/user_Onboarding/selection-page/selection-page';


export const routes: Routes = [
    {path: "", redirectTo: 'welcome', pathMatch: 'full'}, 
    {path: "welcome", component: SplashScreen, title: "Tutorials page"},
    {path: 'uploadResume', component: UploadResume, title: "Upload Resume page"},
    {path: 'ConfirmResume', component: ConfirmResume, title: "Confirm resume details Page"},
    {path: 'SelectionPage', component: SelectionPage, title: "Select desired company and role pages!"},
    {path: 'auth/signup', component: Signup, title: "SignUp page"},
    {path: "auth/login", component: Login, title: "Login page"},
    {path: "auth/verify_email", component: VerifyEmail, title: "Email Verification page"},
    {path: "auth/update_password", component: UpdatePassword, title: "Update Password page"},
    {path: "auth/forgot_password", component: ForgotPassword, title: "Forgot Password page"},
    {
        path: "ui_wrapper",
         component: UserUiWrapper,
          title: "Dashboard Wrapper Page",
          children: [
            {path: "", redirectTo: "dashboard", pathMatch: 'full'}, 
            {path: "dashboard", component: Dashboard, title: "Interview Dashbord Page"},
            {path: "evaluation_report", component: EvaluationReport, title: "AI Evaluation Page"},
            {path: "completed_interviews", component: CompletedInterviews, title: "Completed Interviews Page"},
            {path: "remaining_interviews", component: RemainingInterviews, title: "Remaining Interviews Page"},
            {path: "notifications", component: Notifications, title: "Notifications Page"},
            {path: "resume", component: Resume, title: "Resume Page"},
            {path: "user_profile", component: Profile, title: "Profile Page"}
          ]
    },
];
