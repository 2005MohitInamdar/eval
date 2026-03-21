import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule  } from '@angular/forms'; 

interface ResumeEntries {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  soft_skills: string[];
  technical_skills: string[];
  projects: any[]; 
  experience: any[];
  education: any[]; 
  skills: any[]; 
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
}


@Component({
  selector: 'app-confirm-resume',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './confirm-resume.html',
  styleUrls: ['./confirm-resume.scss'],
})
export class ConfirmResume implements OnInit{
  private platformid = inject(PLATFORM_ID)

  isDisabled:boolean=true
  techSkillVisibility:boolean = true
  projectsVisibility:boolean = true
  educationVisibility:boolean=true
  experienceVisibility:boolean=true

  raw_data!: any
  resume_data!:ResumeEntries
  newSoftSkill:string = ""
  newTechSkill:string = ""
  newProject:string = ""
  exp_Description:string = ""


  edu = [
    {
      institution: "",
      degree: "",
      percentage_or_cgpa: "",
      year_of_passing: ""
    }
  ]


  exp = [
    {
      company: "",
      description: [] as string[],
      job_title: "",
      duration: "",
    }
  ]
  

  resume = new FormGroup ({
    name: new FormControl(""),
    email: new FormControl(),
    phone: new FormControl(),
    location: new FormControl(),
    soft_skills: new FormArray([]),
    technical_skills: new FormArray([]),
    experience: new FormArray([]),
    projects: new FormArray([]),
    education: new FormArray([]), 
    linkedin_url: new FormControl(),
    github_url: new FormControl(),
    portfolio_url: new FormControl()
  })


  ngOnInit():void{
    if(isPlatformBrowser(this.platformid)){
      this.raw_data = localStorage.getItem("resume_data")
      const parsedData = JSON.parse(this.raw_data)
      const placeholder_data = parsedData.data
      this.resume_data = placeholder_data as ResumeEntries;
      

      this.setEducation(this.resume_data.education);
      this.setFieldValue("technical_skills", this.resume_data.skills[0].technical_skills)
      this.setFieldValue("soft_skills", this.resume_data.skills[0].soft_skills)
      this.setFieldValue("projects", this.resume_data.projects)
      this.setExperience(this.resume_data.experience)
      
      this.resume.patchValue({
        name: this.resume_data.full_name,
        email: this.resume_data.email,
        phone: this.resume_data.phone,
        location: this.resume_data.location,
        linkedin_url: this.resume_data.linkedin_url,
        github_url: this.resume_data.github_url,
        portfolio_url: this.resume_data.portfolio_url
      })
    }
  }
  
  constructor(){} 

  fieldArray(field: string):FormArray {
    return this.resume.get(field) as FormArray;
  }

  setFieldValue(field: string, data: string[]) {
    const targetField = this.fieldArray(field)

    data.forEach(d => {
      targetField.push(new FormControl(d))
    })
  }


  get educationArray(): FormArray {
    return this.resume.get('education') as FormArray;
  }

  createEducationGroup(edu?: any): FormGroup {
    return new FormGroup({
      institution:       new FormControl(edu?.institution ?? ''),
      degree:            new FormControl(edu?.degree ?? ''),
      percentage_or_cgpa: new FormControl(edu?.percentage_or_cgpa ?? null),
      year_of_passing:   new FormControl(edu?.year_of_passing ?? ''),
    });
  }

  
  setEducation(educationData: any[]) {
    // this.educationArray.clear(); 

    educationData.forEach(edu => {
      this.educationArray.push(this.createEducationGroup(edu));
    });
  }


  educationSave(){
    this.setEducation(this.edu)
    this.edu = [
      {
        institution: "",
        degree: "",
        percentage_or_cgpa: "",
        year_of_passing: ""
      }
    ]
    this.educationVisibility = !this.educationVisibility
  }

  nestedFieldArray(expIndex: number): FormArray {
    const expGroup = this.experienceArray.at(expIndex) as FormGroup;
    return expGroup.get('description') as FormArray;
  }

  setNestedFieldValue(expIndex: number, data: string[]) {
  const targetField = this.nestedFieldArray(expIndex);
  
    data.forEach(d => {
      targetField.push(new FormControl(d));
    });
  }


  get experienceArray(): FormArray {
    return this.resume.get('experience') as FormArray;
  }
  
 

  createExperienceGroup(exp?: any): FormGroup {

    return new FormGroup({
      company: new FormControl(exp?.company ?? ''),
      duration: new FormControl(exp?.duration ?? ''),
      job_title:   new FormControl(exp?.job_title ?? ''),
      description:   new FormArray([]),
    });
  }

  setExperience(experienceData: any[]) {
    experienceData.forEach((exp, index) => {
    this.experienceArray.push(this.createExperienceGroup(exp));

      if (exp.description && Array.isArray(exp.description)) {
        this.setNestedFieldValue(index, exp.description);
      }
    });
  }
  saveNewExperience(){

    const fixed_desc_data = this.exp_Description.split(",")
    const final_desc_data = fixed_desc_data.map(desc => desc.trim())
    if(final_desc_data){
      this.exp[0].description = final_desc_data
    }
    console.log(typeof this.exp_Description)
    this.setExperience(this.exp)
  }


  toggleVisibility(field:string){
    switch(field){
      case "soft_skills":
        this.isDisabled = !this.isDisabled;
        break;
        case "technical_skills":
          this.techSkillVisibility = !this.techSkillVisibility
        break;
      case "projects":
        this.projectsVisibility = !this.projectsVisibility
        break;  
      case "education":
        this.educationVisibility = !this.educationVisibility
        break;  
      case "experience":
        this.experienceVisibility = !this.experienceVisibility
        break;  
    }
  }
  
  
  saveNewData(field:string, data:string){
    if(field === "projects"){
      const projArray = this.fieldArray("projects")
      projArray.push(new FormControl(data))
    }else{
      const raw_Array = data.split(",");
      const updated_Array = raw_Array.map(s => s = s.trim());
      this.setFieldValue(field, updated_Array);
    }

    switch(field){
      case "soft_skills":
        this.newSoftSkill = "";
        this.isDisabled = !this.isDisabled;
        break;
      case "technical_skills":
        this.newTechSkill = ""
        this.techSkillVisibility = !this.techSkillVisibility
        break;
      case "projects":
        this.newProject = ""
        this.projectsVisibility = !this.projectsVisibility
        break;
    }
  } 



  confirmResumeData(){}
}
