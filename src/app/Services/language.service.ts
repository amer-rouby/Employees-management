import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private defaultLanguageKey: string = 'ar';
  private languageKey: string = 'lang';

  constructor(
    private translate: TranslateService,
    private localStorage: LocalStorageService
  ) {}

  setDefaultLanguage(): void {
    const defaultLang = this.defaultLanguageKey;
    const storedLang = this.localStorage.getItem(this.languageKey) || defaultLang;
    this.setLanguage(storedLang);
  }

  changeLanguage(lang: string): void {
    this.setLanguage(lang);
    this.localStorage.setItem(this.languageKey, lang);
  }

  private setLanguage(lang: string): void {
    const direction = lang === this.defaultLanguageKey ? 'rtl' : 'ltr';
    this.translate.use(lang);
    this.setDirection(direction);
  }

  private setDirection(direction: string): void {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('dir', direction);
  }
}
