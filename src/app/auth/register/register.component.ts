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
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.registrationForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get password() {
    return this.registrationForm.get('password');
  }

  get confirmPassword() {
    return this.registrationForm.get('confirmPassword');
  }

  onSubmit(): void {
    this.toggleLoading(true);
    if (this.registrationForm.valid) {
      const { email, password } = this.registrationForm.value;
      this.authService
        .register(email, password)
        .then(() => {
          this.toastr.success('Registration successful', 'Success');
          this.toggleLoading(false);
        })
        .catch((error) => {
          this.toastr.error('Registration failed', 'Error');
          this.toggleLoading(false);
          console.error('Registration error:', error);
        });
    } else {
      this.toastr.warning('Please fill in all required fields correctly', 'Warning');
      this.toggleLoading(false);
    }
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private toggleLoading(state: boolean): void {
    this.isLoading = state;
  }
}
