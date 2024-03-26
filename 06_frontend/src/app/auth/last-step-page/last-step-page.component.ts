import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-last-step-page',
  templateUrl: './last-step-page.component.html',
  styleUrl: '../auth-styles.css'
})
export class LastStepPageComponent {
  myForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.myForm = this.fb.group({
      description: ['', [
        Validators.required,
      ]]
    });
  }

  onSubmit() {
    if (this.myForm.valid) {
      console.log(this.myForm)
      const userData = this.myForm.value
      this.authService.makeRequest('users', 'put', true, { body: userData })
        .subscribe(
          (response) => {
            console.log(response)
          },
          (error) => {
            console.error(error)
            this.router.navigate(['/'])
          }
        )
    }
  }
}
