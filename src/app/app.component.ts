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

  constructor(public translate: TranslateService, private authService: AuthService) { }

  ngOnInit(): void {
    // Set the default language
    const defaultLang = 'en';
    this.translate.setDefaultLang(defaultLang);
    this.subscribeToLoginStatus();

    // Get the language from localStorage or fallback to the default
    const storedLang = this.getLanguageFromStorage() || defaultLang;
    this.setLanguage(storedLang);
  }

  changeLanguage(lang: string): void {
    this.setLanguage(lang);
    localStorage.setItem('lang', lang); // Save selected language to localStorage
  }

  private setLanguage(lang: string): void {
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    this.translate.use(lang);
    this.setDirection(direction);
  }

  private setDirection(direction: string): void {
    // Set the direction attribute on the HTML element
    document.documentElement.setAttribute('dir', direction);
  }

  private getLanguageFromStorage(): string | null {
    return localStorage.getItem('lang');
  }

  private subscribeToLoginStatus(): void {
    this.loginSubscription = this.authService.isAuthenticated().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn; // Update login status in the app
    });
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe(); // Unsubscribe on component destroy to avoid leaks
    }
  }
}
