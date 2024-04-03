import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }

  uploadFile(file: File): Observable<string> {
    return new Observable(observer => {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

<<<<<<< HEAD
    uploadTask.on('state_changed', 
      (snapshot) => {
        // Optional: Observe state change events such as progress, pause, and resume
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, 
      (error) => {
        // Handle unsuccessful uploads
        console.error('Upload failed', error);
      }, 
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);

          // Here, you can call a method to save the URL to your backend or do something else with it
        });
      }
    );
=======
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Optional: Observe state change events such as progress, pause, and resume
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        }, 
        (error) => {
          // Handle unsuccessful uploads
          console.error('Upload failed', error);
          observer.error(error);
        }, 
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            observer.next(downloadURL);
            observer.complete();
          });
        }
      );
    });
>>>>>>> d1286b87d5efd562c15dff8c6870b8c5eecbdc85
  }
}