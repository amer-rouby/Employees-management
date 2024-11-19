import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LeaveService } from '../../../Services/leave.service';
import { EmployeesService } from '../../../Services/employee-management.service';
import { AuthService } from '../../../Services/auth.service';
import { leaveStatus, leaveTypes } from '../../../constants/data.constants';
import { Leave } from '../../../Models/leave.model';
import { Employee } from '../../../Models/employee.model';
import { PermissionsService } from '../../../Services/permissions.service';

@Component({
  selector: 'app-leave-dialog',
  templateUrl: './leave-dialog.component.html',
  styleUrls: ['./leave-dialog.component.scss'],
  providers: [DatePipe],
})
export class LeaveDialogComponent implements OnInit {
  leaveStatus = leaveStatus;
  leaveTypes = leaveTypes;
  employees: Employee[] = [];
  employeeForm: FormGroup;
  leave: Leave = {
    name: '',
    englishName: '',
    types: '',
    startDate: '',
    endDate: '',
    status: '',
    id: '',
  };
  heCanTakeAction: boolean;

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private employeesService: EmployeesService,
    private permissionsService: PermissionsService,
    private dialogRef: MatDialogRef<LeaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe,
    public translate: TranslateService
  ) {
    this.heCanTakeAction = this.permissionsService.canRegisterUser();

    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      englishName: ['', Validators.required],
      types: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

    if (this.heCanTakeAction) {
      this.employeeForm.addControl('status', this.fb.control('', Validators.required));
    }
  }

  ngOnInit(): void {
    this.loadEmployees();

    if (this.data.action === 'edit' && this.data.leave) {
      this.leave = { ...this.data.leave };
      this.employeeForm.patchValue(this.leave);
    }
  }

  private loadEmployees(): void {
    this.employeesService.getAllEmployees().subscribe((employees: Employee[]) => {
      this.employees = employees;
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.leave = { ...this.leave, ...this.employeeForm.value };
      this.leave.startDate = this.datePipe.transform(this.leave.startDate, 'yyyy-MM-dd') || '';
      this.leave.endDate = this.datePipe.transform(this.leave.endDate, 'yyyy-MM-dd') || '';
  
      let request$: Observable<any>; // Define the type explicitly
  
      if (this.data.action === 'add') {
        request$ = this.leaveService.addLeaveRequest(this.leave);
      } else if (this.data.action === 'edit' && this.leave.id) {
        request$ = this.leaveService.updateLeaveRequest(this.leave.id, this.leave);
      } else {
        return; // Exit if no valid action
      }
  
      request$.subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Error occurred:', err),
      });
    } else {
      // Trigger validation messages or other feedback for the user
      this.employeeForm.markAllAsTouched(); // Mark all fields as touched to display validation messages
    }
  }
  
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
