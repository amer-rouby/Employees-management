import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from './Services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Angular-testing';
  isLoggedIn = false;
  private loginSubscription!: Subscription;

  constructor(
    public translate: TranslateService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.setDefaultLanguage();
    this.subscribeToLoginStatus();
  }

  changeLanguage(lang: string): void {
    this.setLanguage(lang);
    localStorage.setItem('lang', lang); // Save selected language to localStorage
  }

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe(); // Unsubscribe on destroy to prevent memory leaks
  }

  // Private helper methods

  private setDefaultLanguage(): void {
    const defaultLang = 'en';
    this.translate.setDefaultLang(defaultLang);

    const storedLang = this.getLanguageFromStorage() || defaultLang;
    this.setLanguage(storedLang);
  }

  private setLanguage(lang: string): void {
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    this.translate.use(lang);
    this.setDirection(direction);
  }

  private setDirection(direction: string): void {
    document.documentElement.setAttribute('dir', direction);
  }

  private getLanguageFromStorage(): string | null {
    return localStorage.getItem('lang');
  }

  private subscribeToLoginStatus(): void {
    // Subscribe to authentication status from the AuthService
    this.loginSubscription = this.authService.isAuthenticated().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      localStorage.setItem('isLoggedIn', String(isLoggedIn)); // Store login status in localStorage
    });

    // Retrieve login status from localStorage on app init
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }
}
