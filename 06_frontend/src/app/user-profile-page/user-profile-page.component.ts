import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponentComponent } from '../dialog-component/dialog-component.component';
import { UploadService } from '../services/uploadimg.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.css'
})
export class UserProfilePageComponent implements OnInit {
  animal: string = "";
  name: string = "";

  userData: User = {
    username: "",
    habits: [],
    email: "",
    description: "",
    streak: {
      current: 0,
      longest: 0,
      total_blogs: 0
    }
  }

  constructor(public dialog: MatDialog, private upload: UploadService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.makeRequest("users", "get", true)
      .subscribe((response) => {
        console.log(response)
        this.userData = response
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
      if (result) {
        this.userData.habits.push({
          title: result.hobbyTitle,
          frequency: result.schedule,
          time: result.selectedTime
        })
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
      this.upload.uploadFile(file);
    }
  }
}