
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
  registrationForm: FormGroup;
  isLoading: boolean= false;
  constructor(private fb: FormBuilder,private authService: AuthService, private toastr: ToastrService) {

    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.isLoading = true;
    if (this.registrationForm.valid) {
      const { email, password } = this.registrationForm.value;
      this.authService.register(email, password)
        .then(() => {
          this.toastr.success('Registration successful', 'Success');
          this.isLoading = false;
          // Redirect user after successful registration
        })
        .catch(error => {
          this.toastr.error('Registration failed', 'Error');
          this.isLoading = false;
          console.error('Registration error:', error);
        });
    } else {
      this.toastr.warning('Please fill in all required fields correctly', 'Warning');
    }
  }
}
