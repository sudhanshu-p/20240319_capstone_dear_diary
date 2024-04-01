import { Component } from '@angular/core';
import { UploadService } from '../services/uploadimg.service';

@Component({
  selector: 'app-upload-img',
  templateUrl: './upload-img.component.html',
  styleUrl: './upload-img.component.css'
})
export class UploadImgComponent {

  constructor(private upload:UploadService){}
  onFileSelected(event:any) {
    const file: File = event.target.files[0];
    if (file) {
      this.upload.uploadFile(file);
    }
  }
}
