// import { Component, PLATFORM_ID, inject } from '@angular/core';
// import { isPlatformBrowser, CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms'; // 1. Import this
// @Component({
//   selector: 'app-confirm-resume',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './confirm-resume.html',
//   styleUrls: ['./confirm-resume.scss'],
// })
// export class ConfirmResume {
//   private platformid = inject(PLATFORM_ID)
//   resume_data!: any
//   flat_display_list: { label: string, value: string }[] = [];
//   flattenData(obj: any, parentKey = ''): { label: string, value: string }[] {
//     let results: { label: string, value: string }[] = [];

//     for (const key in obj) {
//       if (!obj.hasOwnProperty(key)) continue;

//       // Construct a clean label (e.g., "education_0_degree")
//       const displayLabel = parentKey ? `${parentKey}_${key}` : key;
//       const value = obj[key];

//       if (Array.isArray(value)) {
//         // If it's an array, we "unroll" it
//         value.forEach((item, index) => {
//           if (typeof item === 'object') {
//             results = results.concat(this.flattenData(item, `${displayLabel}_${index}`));
//           } else {
//             results.push({ label: `${displayLabel}_${index}`, value: String(item) });
//           }
//         });
//       } else if (typeof value === 'object' && value !== null) {
//         // If it's a nested object, recurse deeper
//         results = results.concat(this.flattenData(value, displayLabel));
//       } else {
//         // Base case: It's a string/number, just add it
//         results.push({ label: displayLabel, value: String(value || 'N/A') });
//       }
//     }
//     return results;
//   }
//   constructor(){
//     if(isPlatformBrowser(this.platformid)){
//       // console.log("Get item: ")
      
//       const raw_data = localStorage.getItem("resume_data")
//       if(raw_data){
//         const parsed_data = JSON.parse(raw_data)
//         this.resume_data = parsed_data.data
//         // console.log(this.resume_data.data.full_name)
//         if (this.resume_data) {
//           this.flat_display_list = this.flattenData(this.resume_data);
//         }

//         console.log(this.flat_display_list)
        
//       }
//     }
//   } 
//   saveAndProceed(){}
// }



// --------------------------------------------------------------------------------------------------------------
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 1. Import this




@Component({
  selector: 'app-confirm-resume',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './confirm-resume.html',
  styleUrls: ['./confirm-resume.scss'],
})
export class ConfirmResume{
  private platformid = inject(PLATFORM_ID)
  resume_data!: any
  flat_display_list: any = [];


  
  constructor(){
  } 


  // flattenData(obj:any):FlattenedItem[]{
  //   const result: FlattenedItem[] = [];
  //   for(const [outerkey, outervalue] of Object.entries(obj)){
  //     // console.log(`${outerkey}:${outervalue}`)
  //     result.push({ key: outerkey, value: outervalue });
  //     if(Array.isArray(outervalue)){
  //       for(const x of outervalue){
  //         for(const [key, value] of Object.entries(x)){
  //           // console.log(`${key}:${value}`)
  //           result.push({ key, value });
  //         }
  //       }
  //     }
  //   }
  //   return result
  // }



  saveAndProceed(){}
}
