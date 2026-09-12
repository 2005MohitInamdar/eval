import { Injectable, inject } from '@angular/core';


export interface skillsEntry{
  soft_skills: string[],
  projects: string[]
}

export interface experienceEntry{
  job_title: string,  
  company: string,
  duration?: string,
  description?: string[]
}

export interface educationEntry{
  institution: string,
  degree?: string | null,
  percentage_or_cgpa? : string | null,
  year_of_passing?: string | null
}
export interface syncResponse  {
  status: string,
  message:string,
  path_received:string,
  extracted_resume_details: {
    full_name: string
    email: string
    phone?: string | null
    location?: string | null
    education: any[]
    experience: any[]
    skills:any[]
    linkedin_url?: string|null
    github_url: string|null
    portfolio_url: string|null  
  }
}
@Injectable({
  providedIn: 'root',
})


export class UserResume {

  async fileUpload(file:File){
  }
}
