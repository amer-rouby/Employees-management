// register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      this.authService.register(email, password)
        .then(() => {
          this.toastr.success('Registration successful', 'Success');
          // Redirect user after successful registration
        })
        .catch(error => {
          this.toastr.error('Registration failed', 'Error');
          console.error('Registration error:', error);
        });
    } else {
      this.toastr.warning('Please fill in all required fields correctly', 'Warning');
    }
  }
}
