
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private defautLanguageKey: string = 'ar';
  private languageKey: string = 'lang';

  constructor(private translate: TranslateService) {}

  setDefaultLanguage(): void {
    const defaultLang = this.defautLanguageKey;
    const storedLang = this.getStoredLanguage() || defaultLang;
    this.setLanguage(storedLang);
  }

  changeLanguage(lang: string): void {
    this.setLanguage(lang);
    localStorage.setItem(this.languageKey, lang);
  }

  private setLanguage(lang: string): void {
    const direction = lang === this.defautLanguageKey ? 'rtl' : 'ltr';
    this.translate.use(lang);
    this.setDirection(direction);
  }

  private setDirection(direction: string): void {
    const htmlElement = document.documentElement; 
    htmlElement.setAttribute('dir', direction);
  }
  

  private getStoredLanguage(): string | null {
    return localStorage.getItem(this.languageKey);
  }
}
