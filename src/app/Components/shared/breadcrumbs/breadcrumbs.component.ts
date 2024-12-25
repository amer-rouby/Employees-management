import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  @Input() breadcrumbs: { label: string, link?: string }[] = [];
  currentDirection: 'ltr' | 'rtl' = 'ltr';

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    this.updateDirection();
    this.translateService.onLangChange.subscribe(() => this.updateDirection());
  }

  private updateDirection(): void {
    this.currentDirection = this.translateService.currentLang === 'ar' ? 'rtl' : 'ltr';
  }
}
