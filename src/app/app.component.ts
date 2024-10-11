import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Angular-testing';

  constructor(public translate: TranslateService) { }

  ngOnInit(): void {
    // Set the default language
    const defaultLang = 'en';
    this.translate.setDefaultLang(defaultLang);

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
}
