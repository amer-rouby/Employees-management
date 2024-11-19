import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PermissionsService } from './permissions.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private permissionsService: PermissionsService
  ) {
    this.setAuthPersistence();
  }

  private setAuthPersistence(): void {
    this.afAuth.setPersistence('session')
      .then(() => {
        this.afAuth.authState.subscribe(user => {
          if (user) {
            this.permissionsService.loadPermissions(user.uid);
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

  register(email: string, password: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password).then(userCredential => {
      const userId = userCredential.user?.uid;
      if (userId) {
        this.permissionsService.loadPermissions(userId);
      }
      return userCredential;
    });
  }

  login(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password).then(userCredential => {
      const userId = userCredential.user?.uid;
      if (userId) {
        this.permissionsService.loadPermissions(userId);
      }
      return userCredential;
    });
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

  private setLoginStatus(isLoggedIn: boolean): void {
    sessionStorage.setItem('isLoggedIn', String(isLoggedIn));
  }

  private resetLoginStatus(): void {
    this.setLoginStatus(false);
    this.permissionsService.clearPermissions();
  }
}
