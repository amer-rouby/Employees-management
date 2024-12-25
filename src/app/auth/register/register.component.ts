import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidationAuthService } from '../../Services/validationAuth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  breadcrumbs = [
    { label: 'HOME', link: '/' },
    { label: 'SYSTEM_ADMINISTRATION'},
    { label: 'REGISTER.TITLE' }
  ];
  registrationForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.registrationForm = this.fb.group(
      {
        email: [
          '',
          [Validators.required, ValidationAuthService.emailValidator()],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: ValidationAuthService.passwordMatchValidator() }
    );
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.toastr.warning(
        this.translate.instant('REGISTER.WARNING'),
        this.translate.instant('WARNING')
      );
      return;
    }

    this.isLoading = true;
    const { email, password } = this.registrationForm.value;

    this.authService
      .register(email, password)
      .then(() => {
        this.toastr.success(
          this.translate.instant('REGISTER.SUCCESS'),
          this.translate.instant('SUCCESS')
        );
      })
      .catch((error) => {
        this.toastr.error(
          this.translate.instant('REGISTER.FAILURE'),
          this.translate.instant('ERROR')
        );
        console.error('Registration error:', error);
      })
      .finally(() => (this.isLoading = false));
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
}
