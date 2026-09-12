import { Component, OnInit, PLATFORM_ID, inject, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule  } from '@angular/forms'; 
import { Router } from '@angular/router';
import { Supabase } from '../../../../services/supabase/supabase';

export interface ExperienceEntry {
  company: string;
  duration: string;
  job_title: string;
  description: string[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  percentage_or_cgpa: string;
  year_of_passing: string;
}

export interface ResumeEntries {
  id: string;
  name: string;             // Changed from full_name to match "name" in JSON
  email: string;
  phone: string;
  location: string;
  soft_skills: string[];
  technical_skills: string[];
  experience: ExperienceEntry[]; // Strongly typed instead of any[]
  projects: string[];           // Array of strings based on your JSON structure
  education: EducationEntry[];   // Strongly typed instead of any[]
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  selected_company: string;     // Added from JSON
  desired_role: string;         // Added from JSON
}


@Component({
  selector: 'app-resume',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './resume.html',
  styleUrl: './resume.scss',
})
export class Resume implements OnInit{
  private supabaseService = inject(Supabase);
  private  platformid = inject(PLATFORM_ID)
  user_id: string|null = ""
  resume_data: ResumeEntries | null = null;
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router)

  async ngOnInit(){
    if(isPlatformBrowser(this.platformid)){
      this.user_id = localStorage.getItem("userID")
    }
    await this.load_resume()
  }

  async load_resume(){
        
    const { data, error } = await this.supabaseService.supabase
      .from('resumes')
      .select('*')
      .eq('id', this.user_id)
      .maybeSingle<ResumeEntries>();

      if(data){
        console.log(data)
        this.resume_data = data
        this.cdr.detectChanges();
      }else{
        console.log("error faced while fetching resume data: ", error);
      }
  }

  update_resume(){
    // this.router.navigate(['/ui_wrapper/UpdateRes'])
    this.router.navigate(['/uploadResume'])
  }
}