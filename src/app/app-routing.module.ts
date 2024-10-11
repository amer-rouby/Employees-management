import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { EmployeeManagementComponent } from './Components/employee-management/employee-management.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'employee-management', component: EmployeeManagementComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

