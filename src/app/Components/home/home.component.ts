import { Component, OnInit } from '@angular/core';
import { PermissionsService } from '../../Services/permissions.service';
import { EmployeesService } from '../../Services/employee-management.service';
import { LeaveService } from '../../Services/leave.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  canRegisterUser = false;
  employeeCount: number | null = null;
  leaveCount: number | null = null;

  constructor(
    private permissionsService: PermissionsService,
    private employeesService: EmployeesService,
    private leaveService: LeaveService
  ) {}

  ngOnInit() {
    this.canRegisterUser = this.permissionsService.canRegisterUser();

    if (this.canRegisterUser) {
      this.employeesService.getAllEmployees().subscribe({
        next: employees => this.employeeCount = employees.length,
        error: () => this.employeeCount = null,
      });
    }

    this.leaveService.getAllLeaveRequests().subscribe({
      next: leaves => this.leaveCount = leaves.length,
      error: () => this.leaveCount = null,
    });
  }
}
