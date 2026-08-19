import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { PermissionsService } from './permissions.service';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private isLoggedInSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private permissionsService: PermissionsService
  ) {
    const hasToken = !!this.localStorage.getItem(this.tokenKey);
    this.isLoggedInSubject = new BehaviorSubject<boolean>(hasToken);
  }

  register(username: string, password: string): Promise<any> {
    return firstValueFrom(
      this.http.post(`${environment.apiUrl}/auth/register`, { username, password })
    );
  }

  login(username: string, password: string): Promise<any> {
    return firstValueFrom(
      this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { username, password })
    ).then(response => {
      this.localStorage.setItem(this.tokenKey, response.token);
      this.permissionsService.loadPermissions(response.role);
      this.isLoggedInSubject.next(true);
      return response;
    });
  }

  logout(): Promise<void> {
    this.localStorage.removeItem(this.tokenKey);
    this.permissionsService.clearPermissions();
    this.isLoggedInSubject.next(false);
    return Promise.resolve();
  }

  getUserState(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  isAuthenticated(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }
}
