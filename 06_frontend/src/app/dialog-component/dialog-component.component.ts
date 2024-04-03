import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dialog-component',
  templateUrl: './dialog-component.component.html',
  styleUrl: './dialog-component.component.css'
})
export class DialogComponentComponent {
  hobbyTitle: string = ""
  days: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  selectedTime: string = '';
  schedule: boolean[] = Array.from({ length: 7 }, () => false);

  constructor(@Inject(MAT_DIALOG_DATA) public data: Hobby | null, private authService: AuthService) {
    if (data) {
      console.log(data)
      this.selectedTime = data.time
      this.schedule = data.frequency
      this.hobbyTitle = data.title
    }
  }

  isActivityScheduled(dayIndex: number): boolean {
    return this.schedule[dayIndex];
  }

  toggleActivity(dayIndex: number): void {
    this.schedule[dayIndex] = !this.schedule[dayIndex];
  }

  saveHabit() {
    const dataToBeSent: Hobby = {
      title: this.hobbyTitle,
      frequency: this.schedule,
      time: this.selectedTime
    }

    this.authService.makeRequest(`users/habit`, 'post', true, { body: dataToBeSent })
      .subscribe(
        (response) => {
          console.log(response)
        },
        (error) => {
          console.error(error)
        }
      )
  }

  isDisabled() {
    return this.hobbyTitle.length <= 1
  }
}
