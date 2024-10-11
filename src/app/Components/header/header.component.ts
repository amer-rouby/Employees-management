import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private translate: TranslateService) { }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
    this.setDirection(lang);
    localStorage.setItem('lang', lang); // Save selected language to localStorage
  }

  private setDirection(lang: string): void {
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
  }
}
