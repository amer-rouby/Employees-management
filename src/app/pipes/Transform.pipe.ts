import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from '../Services/local-storage.service';

@Pipe({
  name: 'translateText'
})
export class TranslateTextPipe implements PipeTransform {
  constructor(private localStorage: LocalStorageService) {}

  transform(textObj: { arabic: string; english: string }): string {
    const currentLang = this.localStorage.getItem('lang') || 'en';
    return currentLang === 'ar' ? textObj.arabic : textObj.english;
  }
}
