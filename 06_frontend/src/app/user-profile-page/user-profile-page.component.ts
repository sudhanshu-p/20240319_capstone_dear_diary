import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponentComponent } from '../dialog-component/dialog-component.component';
import { UploadService } from '../services/uploadimg.service';
import { AuthService } from '../services/auth.service';
import { UpdateUserService } from '../services/update-user.service';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.css'
})
export class UserProfilePageComponent implements OnInit {
  animal: string = "";
  name: string = "";
  fileSelected: boolean = false;
  file:any;

  userData: User = {
    _id: "",
    username: "",
    userImage:'',
    habits: [],
    email: "",
    description: "",
    streak: {
      current: 0,
      longest: 0,
      total_blogs: 0
    }
  }

  followDetails = {
    followersCount: 0,
    followingCount: 0
  }

  constructor(public dialog: MatDialog, private upload: UploadService, private authService: AuthService,private updateuser:UpdateUserService) { }

  ngOnInit(): void {
    this.authService.makeRequest("users", "get", true)
      .subscribe((response) => {
        console.log(response)
        this.userData = response
        this.followDetails = {
          followersCount: response.followersCount,
          followingCount: response.followingCount
        }
        this.newDescription = this.userData.description
      },
        (error) => {
          console.error(error)
        }
      )
  }

  openDialog(data: Hobby | null): void {
    const dialogRef = this.dialog.open(DialogComponentComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      // If result is found -> Save habit or Delete habit
      if (result) {
        // Case of Save habit
        if (result.hobbyTitle) {
          this.userData.habits.push({
            _id: result._id,
            title: result.hobbyTitle,
            frequency: result.schedule,
            time: result.selectedTime
          })
        }
        else if (result._id) {
          console.log(this.userData)
          this.userData.habits = this.userData.habits.filter((habit: Hobby) => habit._id.toString() !== result._id);
          console.log(this.userData)
        }
      }
    });
  }

  // Why? - To check for if there are changes and then activate the buttons.
  newDescription = this.userData.description

  saveChanges() {
    this.userData.description = this.newDescription
    this.authService.makeRequest("users", "put", true, { body: this.userData })
      .subscribe((response) => {
        console.log(response)
      },
        (error) => {
          console.error(error)
        }
      )
  }

  resetChanges() {
    this.newDescription = this.userData.description
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileSelected = true;
      this.file = file
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.userData.userImage = e.target.result;
      };

      reader.readAsDataURL(file);
      
    }
  }
  updateImage(image:string){
    const userData = {
      userImage:image
    }
    this.updateuser.update(userData).subscribe({
      next:(response)=>{
        console.log("done");
        
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }

  confirmImage(): void {
    this.fileSelected = false; // Reset to false after confirmation
    this.upload.uploadFile(this.file).subscribe({
      next: (downloadURL) => {
        console.log('Download URL:', downloadURL);
        this.updateImage(downloadURL)
        
      },
      error: (error) => {
        console.error('Upload error:', error);
      }
    });
  }
}