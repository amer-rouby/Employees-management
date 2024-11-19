import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './Services/auth.service';
import { LanguageService } from './Services/language.service';

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
    private authService: AuthService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.languageService.setDefaultLanguage();
    this.subscribeToLoginStatus();
  }

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }

  private subscribeToLoginStatus(): void {
    this.loginSubscription = this.authService.isAuthenticated().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      localStorage.setItem('isLoggedIn', String(isLoggedIn));
    });

    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }
}
