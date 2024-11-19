import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private userPermissions: boolean = false;
  private userPermissionsKey: string = 'userPermissions';
  private usersList = ['W7JBBlBDgmfekGnc6imbK9U9czL2', 'RYxN9sPhcUNmACxmRtgeBcCUQ4h2'];

  loadPermissions(userId: string): void {
    this.userPermissions = this.usersList.includes(userId);
    sessionStorage.setItem(this.userPermissionsKey, JSON.stringify(this.userPermissions));
  }

  clearPermissions(): void {
    this.userPermissions = false;
    sessionStorage.removeItem(this.userPermissionsKey);
  }

  hasPermission(): boolean {
    const storedPermissions = sessionStorage.getItem(this.userPermissionsKey);
    this.userPermissions = storedPermissions ? JSON.parse(storedPermissions) : false;
    return this.userPermissions;
  }

  canRegisterUser(): boolean {
    console.log(this.hasPermission());
    return this.hasPermission();
  }
}
