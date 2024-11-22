import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidationAuthService } from '../../Services/validationAuth.service';

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
    private router: Router,
    private translate: TranslateService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, ValidationAuthService.emailValidator()],],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastr.warning(
        this.translate.instant('LOGIN.WARNING'),
        this.translate.instant('WARNING')
      );
      return;
    }

    this.toggleLoading(true);
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password)
      .then(() => {
        this.toastr.success(
          this.translate.instant('LOGIN.SUCCESS'),
          this.translate.instant('SUCCESS')
        );
        this.router.navigate(['/home']);
      })
      .catch(error => {
        this.toastr.error(
          this.translate.instant('LOGIN.FAILURE'),
          this.translate.instant('ERROR')
        );
        console.error('Login error:', error);
      })
      .finally(() => this.toggleLoading(false));
  }

  private toggleLoading(state: boolean): void {
    this.isLoading = state;
  }
}
