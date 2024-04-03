import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponentComponent } from '../dialog-component/dialog-component.component';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.css'
})
export class UserProfilePageComponent {
  animal: string = "";
  name: string = "";

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponentComponent, {
      data: { name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  userData = {
    username: 'Sudhanshu12',
    email: 'abcd@gmail.com',
    description: 'Sample Description of the user'
  };

  // Why? - To check for if there are changes and then activate the buttons.
  newDescription = this.userData.description

  saveChanges() {
    this.userData.description = this.newDescription
    console.log('Changes saved:', this.userData);
  }

  resetChanges() {
    this.newDescription = this.userData.description
  }
}