// import { Routes } from '@angular/router';
// import { Login } from './components/authentication/login/login';
// import { Signup } from './components/authentication/signup/signup';
// import { SplashScreen } from './components/splash_screen/splash-screen/splash-screen';
// import { UpdatePassword } from './components/authentication/auth_functions/update-password/update-password'; 
// import { VerifyEmail } from './components/authentication/auth_functions/verify-email/verify-email'; 
// import { ForgotPassword } from './components/authentication/auth_functions/forgot-password/forgot-password'; 
// import { authGuard } from './services/authGuard';
// import { guestGuard } from './services/guestGuard';
// // import { UploadResume } from './components/user_Onboarding/upload-resume/upload-resume';
// export const routes: Routes = [
//     {path: "", redirectTo: 'welcome', pathMatch: 'full'}, 
//     {path: "welcome", component: SplashScreen, title: "Tutorials page"},      
//       {
//           path: 'uploadResume',
//           title: "Upload Resume page", 
//           canActivate: [authGuard],
//           // component: UploadResume
//           loadComponent: () => import ('./components/user_Onboarding/upload-resume/upload-resume').then(m => m.UploadResume)
//       },
//       {
//           path: 'ConfirmResume',
//           title: "Confirm resume details Page", 
//           canActivate: [authGuard],
//           // component: UploadResume
//           loadComponent: () => import ('./components/user_Onboarding/confirm-resume/confirm-resume').then(m => m.ConfirmResume)
//       },
//       {
//           path: 'SelectionPage',
//           title: "Select desired company and role pages!", 
//           canActivate: [authGuard],
//           // component: UploadResume
//           loadComponent: () => import ('./components/user_Onboarding/selection-page/selection-page').then(m => m.SelectionPage)
//       },
//       // app.routes.ts

//     {path: 'auth/signup', component: Signup, title: "SignUp page", canActivate: [guestGuard]},
//     {path: "auth/login", component: Login, title: "Login page", canActivate: [guestGuard]},
//     {path: "auth/verify_email", component: VerifyEmail, title: "Email Verification page"},
//     {path: "auth/update_password", component: UpdatePassword, title: "Update Password page"},
//     {path: "auth/forgot_password", component: ForgotPassword, title: "Forgot Password page"},
//     {
//       path: "mockInterview",
//       title: "MOCK interview Page",
//       canActivate: [authGuard], 
//       loadComponent: () => import('./components/mock-interview/mock-interview').then(m => m.MockInterview),
//     },
//     {
//         path: "ui_wrapper",
//         title: "Dashboard Wrapper Page",
//         canActivateChild: [authGuard],
//         loadComponent: () => import ('./components/interview_dashboard/user-ui-wrapper/user-ui-wrapper').then(m => m.UserUiWrapper),
//           children: [
//             {path: "", redirectTo: "dashboard", pathMatch: 'full'}, 
//             {
//               path: "dashboard",
//               title: "Interview Dashbord Page",
//               loadComponent: () => import ('./components/interview_dashboard/dashboard/dashboard').then(m => m.Dashboard)
//             },
//             {
//               path: "evaluation_report", 
//               title: "AI Evaluation Page",
//               loadComponent: () =>  import('./components/interview_dashboard/dashboard_functions/evaluation-report/evaluation-report').then(m => m.EvaluationReport)
//             },
//             {
//               path: "completed_interviews", 
//               title: "Completed Interviews Page",
//               loadComponent: () =>  import('./components/interview_dashboard/dashboard_functions/completed-interviews/completed-interviews').then(m => m.CompletedInterviews)
//             },
//             {
//               path: "remaining_interviews", 
//               title: "Remaining Interviews Page",
//               loadComponent: () =>  import('./components/interview_dashboard/dashboard_functions/remaining-interviews/remaining-interviews').then(m => m.RemainingInterviews)
//             },
//             {
//               path: "notifications", 
//               title: "Notifications Page",
//               loadComponent: () =>  import('./components/interview_dashboard/dashboard_functions/notifications/notifications').then(m => m.Notifications)
//             },
//             {
//               path: "resume", 
//               title: "Resume Page",
//               loadComponent: () =>  import('./components/interview_dashboard/dashboard_functions/resume/resume').then(m => m.Resume)
//             },
//             {
//               path: "user_profile", 
//               title: "Profile Page",
//               loadComponent: () =>  import('./components/interview_dashboard/dashboard_functions/profile/profile').then(m => m.Profile)
//             }
//           ]
//     },
// ];
// ------------------------------------------------------------------------------------------------------------




import { Routes } from "@angular/router";
import { UploadResume } from "./components/user_Onboarding/upload-resume/upload-resume";
import { ConfirmResume } from "./components/user_Onboarding/confirm-resume/confirm-resume";
export const routes: Routes =  [
  {path: '', redirectTo: 'uploadResume', pathMatch:'full'}, 
  {path: 'uploadResume', component: UploadResume, title: 'upload resume page'},
  {path: 'ConfirmResume', component: ConfirmResume, title: 'confirm resume page'}
]