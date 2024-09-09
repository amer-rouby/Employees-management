import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private translate: TranslateService, private authService: AuthService) { }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
    this.setDirection(lang);
    localStorage.setItem('lang', lang); // Save selected language to localStorage
  }

  private setDirection(lang: string): void {
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
  }

  logout(): void {
    this.authService.logout().then(() => {
      // Redirect to login or any other page after logout
      window.location.href = '/login'; // Or use Router for navigation
    }).catch(error => {
      console.error('Logout failed', error);
    });
  }
}
