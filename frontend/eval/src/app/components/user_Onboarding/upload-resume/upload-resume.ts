import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule  } from '@angular/common';
import { DragnDrop } from './dragNDropDirective/dragn-drop';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { NavTop } from '../../navbar_components/nav-top/nav-top';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import { environment } from '../../../../environments/environment.development';
@Component({
  selector: 'app-upload-resume',
  standalone:true,
  imports: [DragnDrop, NavTop, CommonModule],
  templateUrl: './upload-resume.html',
  styleUrls: ['./upload-resume.scss'],
})

export class UploadResume implements OnInit{
  private router = inject(Router);
  private authService = inject(Auth);
  private platformId = inject(PLATFORM_ID)
  private http = inject(HttpClient)
  fileName: string | undefined = ""
  selectedFile!:File | undefined 
  isUploading = false;
  uploadError: string | null = null;

  
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (window.location.search.includes('code=')) {
        this.router.navigate([], {
          queryParams: { code: null },
          queryParamsHandling: 'merge', 
          replaceUrl: true              
        });
      }
    }
  }


  onFileSelected(event:Event){
    if (this.isUploading) return

    const input = event.target as HTMLInputElement
    this.fileName = input.files?.[0].name
    this.selectedFile = input.files?.[0]
    this.uploadError = null;
  }

  handleDroppedFiles(file:File){
    if (this.isUploading) return   
    this.fileName = file.name
    this.selectedFile = file
    this.uploadError = null;
  }
  
  completion_route(){
    this.router.navigate(['/ConfirmResume'])
  }


  async fileUpload(file: File | undefined) {
    this.uploadError = null;
    if (!file) {
      this.uploadError = 'Select a resume before continuing.';
      alert(this.uploadError);
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    ];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; 

    if (!allowedTypes.includes(file.type)) {
      this.uploadError = 'Please upload a PDF or DOCX file.';
      alert(this.uploadError);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      this.uploadError = 'File is too large. The maximum size is 5MB.';
      alert(this.uploadError);
      return;
    }

    this.isUploading = true;

    try {
      await this.authService.checkAuthStatus();
    } catch (err) {
      this.isUploading = false;
      this.router.navigate(['/auth/login']);
      return;
    }


    const formData = new FormData();
    formData.append('file', file, file.name);

    this.http.post(`${environment.apiUrl}/uploadedResume`, formData, { withCredentials: true }).pipe(
      finalize(() => this.isUploading = false)
    ).subscribe({
      next: (res: any) => {
        const response_data = res.extracted_resume_details;
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem("resume_data", JSON.stringify(response_data));
          localStorage.setItem("resume_file_name", file.name);
        }
        this.completion_route();
      },
      error: (err) => {
        this.uploadError = err?.error?.detail || 'Resume upload failed. Please try again.';
        alert(this.uploadError);
      }
    });
  }

  submitResume(){
    if (this.isUploading) return 

    this.fileUpload(this.selectedFile)
  } 
}
