import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private localStorage: LocalStorageService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.localStorage.getItem('authToken');
    const isLoginRequest = req.url.endsWith('/auth/login');

    const authReq = (token && !isLoginRequest)
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(authReq).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.localStorage.removeItem('authToken');
          this.localStorage.removeItem('userRole');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
