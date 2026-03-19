import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DragnDrop } from './dragNDropDirective/dragn-drop';
import { HttpClient } from '@angular/common/http';
// import { RouterLink } from '@angular/router';
import { NavTop } from '../../navbar_components/nav-top/nav-top';
import { Router } from '@angular/router';
import { Supabase } from '../../../services/supabase/supabase';
import { syncResponse } from '../../../services/resume/user-resume';
@Component({
  selector: 'app-upload-resume',
  standalone:true,
  imports: [DragnDrop, NavTop],
  templateUrl: './upload-resume.html',
  styleUrls: ['./upload-resume.scss'],
})

export class UploadResume implements OnInit{
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID)
  private http = inject(HttpClient)
  private supabaseService = inject(Supabase)
  fileName: string | undefined = ""
  selectedFile!:File | undefined 


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

    if(!user){
      return 
    }

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const name_of_file = `${Date.now()}_${sanitizedName}`; 
    const filePath = `${user.id}/${name_of_file}`;

    console.log("filePath: ", filePath)
    const {data, error} = await this.supabaseService.supabase.storage.from('resumes').upload(filePath, file)
    if(error){
      console.log(error)
      alert(`resume upload unsuccessful: ${error}`)
    }
    else{
      console.log(data.path)
      const payload = {
        'file_path' : data.path,
        'file_name' : name_of_file,
        'mime_type' : file.type
      }
      this.http.post('http://127.0.0.1:8000/uploadedResume', payload).subscribe({
        next: (res:any) => {
          const response_data = res.extracted_resume_details
          localStorage.setItem("resume_data", JSON.stringify(response_data))
        },
        error: (err) => {
          console.log("unSuccessful: ", err)
        }
      })
      alert("File upload successful!")
    }
  }


  submitResume(){
    console.log("File selected", this.fileName)
    this.fileSupabaseUpload(this.selectedFile)

  } 
}