import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Supabase } from '../../../services/supabase/supabase';
// import { Phone } from 'lucide-angular';
import { LoginService } from '../../../services/login_service/login-service';
@Component({
  selector: 'app-selection-page',
  standalone: true, 
  imports: [CommonModule, FormsModule],
  templateUrl: './selection-page.html',
  styleUrls: ['./selection-page.scss'],
})
export class SelectionPage {
  private loginService = inject(LoginService)
  private router = inject(Router)
  private platformid = inject(PLATFORM_ID)
  private supabaseService = inject(Supabase)
  desired_company:string = ""
  desired_role:string = ""


  get_resume_data(){
    return localStorage.getItem("resume_data")
  }

  async submit_desired_selection(){
    const getuser = await this.loginService.getCurrentUser();
    const userID = getuser?.id;
    if(isPlatformBrowser(this.platformid)){
      localStorage.setItem("desired_company", this.desired_company)
      localStorage.setItem("desired_role", this.desired_role)

      const rawdata = this.get_resume_data();
      const resume_data = rawdata? JSON.parse(rawdata) : null

      console.log(resume_data.name)

      const{data, error} = await this.supabaseService.supabase
      .from('resumes')
      .insert({
        id: userID,
        name: resume_data.name,
        email: resume_data.email,
        phone: resume_data.phone,
        location: resume_data.location,
        soft_skills: resume_data.soft_skills,
        technical_skills: resume_data.technical_skills,
        experience: resume_data.experience,
        projects: resume_data.projects,
        education: resume_data.education,
        linkedin_url: resume_data.linkedin_url,
        github_url: resume_data.github_url,
        portfolio_url: resume_data.portfolio_url,
        selected_company: localStorage.getItem("desired_company"),
        desired_role: localStorage.getItem("desired_role")
      })
      if(error){
        console.log("Error occured")
      }
      if(data){
        console.log(data)
      }
      if(userID){
        localStorage.setItem("userID", String(userID));
      }
      localStorage.removeItem("resume_data")  
      localStorage.removeItem("desired_company")  
      localStorage.removeItem("desired_role") 
       
      this.router.navigate(['/ui_wrapper'])    
      
      this.desired_company = "";
      this.desired_role = ""

    }
  }
}
