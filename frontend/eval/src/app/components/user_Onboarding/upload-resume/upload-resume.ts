import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DragnDrop } from './dragNDropDirective/dragn-drop';
import { HttpClient } from '@angular/common/http';
// import { RouterLink } from '@angular/router';
import { NavTop } from '../../navbar_components/nav-top/nav-top';
import { Router } from '@angular/router';
@Component({
  selector: 'app-upload-resume',
  standalone:true,
  imports: [DragnDrop, NavTop],
  templateUrl: './upload-resume.html',
  styleUrls: ['./upload-resume.scss'],
})
export class UploadResume implements OnInit{
  router = inject(Router);
  private platformId = inject(PLATFORM_ID)
  // fileInput:string = ""
  private http = inject(HttpClient)
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

  submitResume(){
    
  }
}