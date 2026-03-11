import { Component, inject } from '@angular/core';
import { DragnDrop } from './dragNDropDirective/dragn-drop';
import { HttpClient } from '@angular/common/http';
// import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-upload-resume',
  standalone:true,
  imports: [DragnDrop],
  templateUrl: './upload-resume.html',
  styleUrls: ['./upload-resume.scss'],
})
export class UploadResume {
  // fileInput:string = ""
  private http = inject(HttpClient)
  fileName: string | undefined = ""
  selectedFile!:File | undefined 

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