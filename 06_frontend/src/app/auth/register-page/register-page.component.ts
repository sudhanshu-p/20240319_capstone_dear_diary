import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../snackbar/snackbar.component';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: '../auth-styles.css'
})
export class RegisterPageComponent {
  myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.myForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z][a-zA-Z0-9@#$%^&+=]*$'),
        Validators.minLength(8)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=]).*$'),
        Validators.minLength(8)
      ]]
    });
  }

  onSubmit() {
    if (this.myForm.valid) {
      console.log(this.myForm)
      const userData = this.myForm.value
      this.authService.register(userData).subscribe(
        (response) => {
          console.log('Registration successful:', response);
          this.router.navigate(['/last-step'])
        },
        (error) => {
          console.error('Registration error:', error);
        }
      );
    }
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: 5000,
    });
  }
}
