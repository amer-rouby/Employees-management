// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './Components/home/home.component';
import { EmployeeManagementComponent } from './Components/employee-management/employee-management.component';
import { AuthGuard } from './Guards/auth.guard';
import { RedirectIfLoggedInGuard } from './Guards/redirect-if-logged-in.guard';
import { LeaveManagementComponent } from './Components/leave-management/leave-management.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'employee-management', component: EmployeeManagementComponent, canActivate: [AuthGuard] },
  { path: 'leave-management', component: LeaveManagementComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [RedirectIfLoggedInGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' } // Redirect unknown routes to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
