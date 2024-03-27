import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: '../auth-styles.css'
})
export class LoginPageComponent {
  myForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.myForm = this.fb.group({
      userKey: ['', [
        Validators.required,
      ]],
      password: ['', [
        Validators.required,
      ]]
    });
  }

  onSubmit() {
    if (this.myForm.valid) {
      console.log(this.myForm)
      const userData = this.myForm.value
      this.authService.login(userData).subscribe(
        (response) => {
          console.log('Login successful.');
          this.router.navigate(['/'])
        },
        (error) => {
          console.error('Registration error:', error);
        }
      );
    }
  }
}
