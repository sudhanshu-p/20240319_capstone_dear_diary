import { Component } from '@angular/core';

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

  isActivityScheduled(dayIndex: number): boolean {
    return this.schedule[dayIndex];
  }

  toggleActivity(dayIndex: number): void {
    this.schedule[dayIndex] = !this.schedule[dayIndex];
  }

  saveHabit() {
    console.log("Habit saved!")
  }

  isDisabled() {
    return this.hobbyTitle.length <= 1
  }
}
