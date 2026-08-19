import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private userRoleKey: string = 'userRole';

  constructor(private localStorage: LocalStorageService) { }

  loadPermissions(role?: string): void {
    if (role) {
      this.localStorage.setItem(this.userRoleKey, role);
    }
  }

  clearPermissions(): void {
    this.localStorage.removeItem(this.userRoleKey);
  }

  hasPermission(): boolean {
    return this.localStorage.getItem(this.userRoleKey) === 'ADMIN';
  }

  canRegisterUser(): boolean {
    return this.hasPermission();
  }
}
