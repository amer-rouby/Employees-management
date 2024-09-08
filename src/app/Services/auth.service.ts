import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // signUp?key=[API_KEY]
  firebaseRestAPI = "https://identitytoolkit.googleapis.com/v1/accounts:"
  apiKey = "AIzaSyBHfgM_etC9-Oec-Tb-__AEojuUxd9IC5U"
  signUp = `${this.firebaseRestAPI}signUp?key=${this.apiKey}`
  constructor() { }
}
