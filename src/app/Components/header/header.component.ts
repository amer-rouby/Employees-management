import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { LanguageService } from '../../Services/language.service';
import { PermissionsService } from '../../Services/permissions.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  canRegisterUser = false;

  constructor(
    private authService: AuthService,
    private permissionsService: PermissionsService,
    private languageService: LanguageService,
  ) {}

  ngOnInit(): void {
    this.canRegisterUser = this.permissionsService.canRegisterUser();
  }

  changeLanguage(lang: string): void {
    this.languageService.changeLanguage(lang);
  }

  logout(): void {
    this.authService.logout().then(() => {
      window.location.href = '/login';
    }).catch(error => {
      console.error('Logout failed', error);
    });
  }
}
