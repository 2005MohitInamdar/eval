import { Directive, HostListener, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appDragnDrop]',
  standalone: true
})
export class DragnDrop {
  @Output() filesDropped = new EventEmitter<File>();
  constructor() {}
  @HostListener('dragover', ['$event']) public onDragOver(event: DragEvent){
    event.preventDefault()
    event.stopPropagation()
  }

  @HostListener('dragleave', ['$event']) public OnDragLeave(event:DragEvent){
    event.preventDefault()
    event.stopPropagation()
  }

  @HostListener('drop', ['$event']) public onDrop(event:DragEvent){
    event?.preventDefault()
    event?.stopPropagation()

    const files = event.dataTransfer?.files
    if(files && files?.length>0){
      const file = files[0]
      this.filesDropped.emit(file)
    }
  }
}
