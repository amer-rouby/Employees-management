import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './Services/auth.service';
import { LanguageService } from './Services/language.service';
import { LocalStorageService } from './Services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  private loginSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private languageService: LanguageService,
    private localStorage: LocalStorageService
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
      this.localStorage.setItem('isLoggedIn', String(isLoggedIn));
    });

    this.isLoggedIn = this.localStorage.getItem('isLoggedIn') === 'true';
  }
}
