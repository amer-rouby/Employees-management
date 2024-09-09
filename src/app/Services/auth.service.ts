import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseRestAPI = "https://identitytoolkit.googleapis.com/v1/accounts:";
  apiKey = "AIzaSyBHfgM_etC9-Oec-Tb-__AEojuUxd9IC5U";
  signUp = `${this.firebaseRestAPI}signUp?key=${this.apiKey}`;

  constructor(private afAuth: AngularFireAuth) {}

  register(email: string, password: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  login(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }

  getUserState(): Observable<firebase.default.User | null> {
    return this.afAuth.authState;
  }

  isAuthenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => !!user)
    );
  }
}
