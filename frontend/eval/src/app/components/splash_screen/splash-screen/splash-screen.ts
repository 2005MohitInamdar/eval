import { Component, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common'; // Important import
@Component({
  selector: 'app-splash-screen',
  standalone:  true,
  imports: [RouterLink],
  templateUrl: './splash-screen.html',
  styleUrls: ['./splash-screen.scss'],
})
export class SplashScreen {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  // This links the #videoElement from HTML to this variable
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  
  // This links the #canvasElement from HTML to this variable
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  // ngAfterViewInit() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     const video = this.videoElement.nativeElement;
  //     const canvas = this.canvasElement.nativeElement;
  //     const ctx = canvas.getContext('2d', { willReadFrequently: true });

  //     video.play();

  //     const processFrame = () => {
  //       if (video.paused || video.ended) return;
        
  //       ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
  //       let frame = ctx?.getImageData(0, 0, canvas.width, canvas.height);
  //       if (frame) {
  //         let l = frame.data.length / 4;
          
  //         for (let i = 0; i < l; i++) {
  //           let r = frame.data[i * 4 + 0];
  //           let g = frame.data[i * 4 + 1];
  //           let b = frame.data[i * 4 + 2];
            
  //           // Chroma Key Logic: If pixel is "Greenish", set Alpha to 0
  //           if (g > 100 && g > r * 1.2 && g > b * 1.2) {
  //             frame.data[i * 4 + 3] = 0;
  //           }
  //         }
  //         ctx?.putImageData(frame, 0, 0);
  //       }
  //       requestAnimationFrame(processFrame);
  //     };

  //     video.addEventListener('play', processFrame);
  //   }
  // }



  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const video = this.videoElement.nativeElement;
      const canvas = this.canvasElement.nativeElement;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      video.play();

      const processFrame = () => {
        if (video.paused || video.ended) return;

        // Wait until video has real dimensions
        if (video.videoWidth === 0 || video.videoHeight === 0) {
          requestAnimationFrame(processFrame);
          return;
        }

        const vw = video.videoWidth;
        const vh = video.videoHeight;

        // --- CROP SETTINGS: tweak these to zoom/reframe the character ---
        const cropTop = vh * 0.0;       // skip top 5% (remove empty space above head)
        const cropBottom = vh * 0.35;    // skip bottom 5% (remove empty space below feet)
        const cropLeft = vw * 0.10;      // skip left 15% (tighten horizontal)
        const cropRight = vw * 0.15;     // skip right 15%

        const srcX = cropLeft;
        const srcY = cropTop;
        const srcW = vw - cropLeft - cropRight;
        const srcH = vh - cropTop - cropBottom;

        // Draw cropped region stretched to fill the full canvas
        ctx?.drawImage(video, srcX, srcY, srcW, srcH, 0, 0, canvas.width, canvas.height);

        let frame = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (frame) {
          let l = frame.data.length / 4;
          for (let i = 0; i < l; i++) {
            let r = frame.data[i * 4 + 0];
            let g = frame.data[i * 4 + 1];
            let b = frame.data[i * 4 + 2];
            if (g > 100 && g > r * 1.2 && g > b * 1.2) {
              frame.data[i * 4 + 3] = 0;
            }
          }
          ctx?.putImageData(frame, 0, 0);
        }

        requestAnimationFrame(processFrame);
      };

      video.addEventListener('play', processFrame);
    }
  }
}
