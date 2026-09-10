import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { DragnDrop } from '../../user_Onboarding/upload-resume/dragNDropDirective/dragn-drop'; 
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Supabase } from '../../../services/supabase/supabase';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../services/login_service/login-service';
import { Auth } from '../../../services/auth';
// import {}
@Component({
  selector: 'app-update-res',
  imports: [DragnDrop, CommonModule, FormsModule],
  templateUrl: './update-res.html',
  styleUrl: './update-res.scss',
})
export class UpdateRes implements OnInit{
  private loginService = inject(LoginService)
  private authService = inject(Auth)
  desired_company:string = ""
  desired_role:string = ""




   private router = inject(Router);
    private platformId = inject(PLATFORM_ID)
    private http = inject(HttpClient)
    private supabaseService = inject(Supabase)
    fileName: string | undefined = ""
    selectedFile!:File | undefined 
    resume_file_name:string | null = ""
  
    ngOnInit() {
      // If the URL has a code, kill it immediately and replace the history entry
      if (isPlatformBrowser(this.platformId)) {
        if (window.location.search.includes('code=')) {
          this.router.navigate([], {
            queryParams: { code: null },
            queryParamsHandling: 'merge', // Remove ONLY the code
            replaceUrl: true              // Overwrite the 'code' entry in the browser history
          });
        }
        this.resume_file_name = localStorage.getItem("resume_file_name")
      }
    }
  
  
    onFileSelected(event:Event){
      const input = event.target as HTMLInputElement
      this.fileName = input.files?.[0].name
      this.selectedFile = input.files?.[0]
    }
  
    handleDroppedFiles(file:File){
      console.log("Received file", file)
      this.fileName = file.name
      this.selectedFile = file
    }
  
  
    async fileSupabaseUpload(file:File | undefined){
      if(!file){
        console.log("No file selected!")
        return 
      }
  
      const { data: { user } } = await this.supabaseService.supabase.auth.getUser();
  
      if(!user) return; 
      
      const oldFilePath = localStorage.getItem("resume_file_name"); 

      if (oldFilePath) {
        const { error: deleteError } = await this.supabaseService.supabase.storage
          .from('resumes')
          .remove([oldFilePath]);

        if (deleteError) {
          console.warn("Could not delete old file from storage:", deleteError.message);
        } else {
          console.log("Successfully deleted old file:", oldFilePath);
        }
      }
  
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const name_of_file = `${Date.now()}_${sanitizedName}`; 
      const filePath = `${user.id}/${name_of_file}`;
  
      console.log("New filePath: ", filePath);

      // const {data, error} = await this.supabaseService.supabase.storage.from('resumes').upload(filePath, file)
      const { data, error } = await this.supabaseService.supabase.storage
      .from('resumes')
      .upload(filePath, file, { upsert: true });
      
      if(error){
        console.log(error)
        alert(`resume upload unsuccessful: ${error}`)
      }
      else{
        console.log("New file uploaded to path:", data.path);

        localStorage.setItem("resume_file_name", data.path);
        const payload = {
          'file_path' : data.path,
          'file_name' : name_of_file,
          'mime_type' : file.type
        }

        this.http.post('http://localhost:8000/uploadedResume', payload).subscribe({
          next: async (res:any) => {
            const response_data = res.extracted_resume_details
            localStorage.setItem("resume_data", JSON.stringify(response_data))

            const getuser = await this.authService.checkAuthStatus();;
            const currentUser = res.user;
            const userID = currentUser.id;
            if(isPlatformBrowser(this.platformId)){
              localStorage.setItem("desired_company", this.desired_company)
              localStorage.setItem("desired_role", this.desired_role)
        
              const rawdata = localStorage.getItem("resume_data");
              const resume_data = rawdata? JSON.parse(rawdata) : null
        
              console.log(resume_data.name) 

              const stringUserId = String(userID);
              const extractedSkills = resume_data.skills?.[0] || { soft_skills: [], technical_skills: [] };
              // const formattedProjects = resume_data.projects.map((projStr: string) => {
              //   const parts = projStr.split('–');
              //   return {
              //     title: parts[0]?.trim() || projStr,
              //     description: parts[1]?.trim() || ''
              //   };
              // });
              const{data, error} = await this.supabaseService.supabase
              .from('resumes')
              .upsert({
                id: stringUserId,
                name: resume_data.full_name,
                email: resume_data.email,
                phone: resume_data.phone,
                location: resume_data.location,
                soft_skills: extractedSkills.soft_skills,
                technical_skills: extractedSkills.technical_skills,
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
                const errorMessage = error.message || JSON.stringify(error)
                console.log("Error occured", error)
                alert("Error occured "+ errorMessage);
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
              
              this.desired_company = "";
              this.desired_role = ""
        
            }
            this.completion_route()
          },
          error: (err) => {
            console.log("unSuccessful: ", err)
          }
        })
        alert("File upload successful!")
      }
    }
  
    completion_route(){
      this.router.navigate(['/ui_wrapper/resume'])
    }

    submitResume(){
      console.log("File selected", this.fileName)
      this.fileSupabaseUpload(this.selectedFile)
      if(isPlatformBrowser(this.platformId)){
        localStorage.setItem("desired_company", this.desired_company)
        localStorage.setItem("desired_role", this.desired_role)
      }
    } 
}