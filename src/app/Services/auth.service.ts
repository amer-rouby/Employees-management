import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userPermissions: boolean = false;

  constructor(private afAuth: AngularFireAuth) {
    this.setAuthPersistence();
    this.loadStoredPermissions();
  }

  private setAuthPersistence(): void {
    this.afAuth.setPersistence('session')
      .then(() => {
        this.afAuth.authState.subscribe(user => {
          if (user) {
            this.loadUserPermissions(user.uid);
            this.setLoginStatus(true);
          } else {
            this.resetLoginStatus();
          }
        });
      })
      .catch(error => {
        console.error('Error setting persistence:', error);
      });
  }

  private loadStoredPermissions(): void {
    const storedPermissions = sessionStorage.getItem('userPermissions');
    if (storedPermissions) {
      this.userPermissions = JSON.parse(storedPermissions);
    }
  }

  register(email: string, password: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  login(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(() => this.setLoginStatus(true));
  }

  logout(): Promise<void> {
    return this.afAuth.signOut().then(() => this.resetLoginStatus());
  }

  getUserState(): Observable<firebase.default.User | null> {
    return this.afAuth.authState;
  }

  isAuthenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(map(user => !!user));
  }

  getLoginStatus(): boolean {
    return sessionStorage.getItem('isLoggedIn') === 'true';
  }

  private setLoginStatus(isLoggedIn: boolean): void {
    sessionStorage.setItem('isLoggedIn', String(isLoggedIn));
  }

  private resetLoginStatus(): void {
    this.setLoginStatus(false);
    this.userPermissions = false; // Reset user permissions on logout
    sessionStorage.removeItem('userPermissions');
  }

  private loadUserPermissions(userId: string): void {
    this.userPermissions = userId === 'W7JBBlBDgmfekGnc6imbK9U9czL2' || userId === 'RYxN9sPhcUNmACxmRtgeBcCUQ4h2';
    sessionStorage.setItem('userPermissions', JSON.stringify(this.userPermissions));
  }

  canRegisterUser(): boolean {
    return this.userPermissions;
  }
}
