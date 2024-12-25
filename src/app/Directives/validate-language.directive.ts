import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appValidateLanguage]'
})
export class ValidateLanguageDirective {
  @Input('appValidateLanguage') languageType: 'arabic' | 'english' = 'arabic';

  private arabicRegex = /^[\u0600-\u06FF\s]*$/;
  private englishRegex = /^[a-zA-Z\s]*$/;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent): void {
    const input = this.el.nativeElement.value;

    if (this.languageType === 'arabic' && !this.arabicRegex.test(input)) {
      this.el.nativeElement.value = input.replace(/[^ء-ي\s]/g, '');
    } else if (this.languageType === 'english' && !this.englishRegex.test(input)) {
      this.el.nativeElement.value = input.replace(/[^a-zA-Z\s]/g, '');
    }
  }
}
