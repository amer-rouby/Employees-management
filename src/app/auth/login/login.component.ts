import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastr.warning('Please fill in all required fields correctly', 'Warning');
      return;
    }

    this.toggleLoading(true);

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password)
      .then(() => {
        this.toastr.success('Login successful', 'Success');
        this.router.navigate(['/home']);
      })
      .catch(error => {
        this.toastr.error('Login failed', 'Error');
        console.error('Login error:', error);
      })
      .finally(() => {
        this.toggleLoading(false);
      });
  }

  private toggleLoading(state: boolean): void {
    this.isLoading = state;
  }
}
