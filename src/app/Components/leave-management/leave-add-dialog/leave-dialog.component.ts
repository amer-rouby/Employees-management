import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LeaveService } from '../../../Services/leave.service';
import { Leave } from '../../../Models/leave.model';
import { DatePipe } from '@angular/common';
import { leaveStatus, leaveTypes } from '../../../constants/data.constants';
import { EmployeesService } from '../../../Services/employee-management.service';
import { Employee } from '../../../Models/employee.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-leave-dialog',
  templateUrl: './leave-dialog.component.html',
  styleUrls: ['./leave-dialog.component.scss'],
  providers: [DatePipe]
})
export class LeaveDialogComponent implements OnInit {
  leaveStatus = leaveStatus;
  leaveTypes= leaveTypes;
  employees: Employee[] = [];
  employeeForm: FormGroup;
  leave: Leave = {
    employee: '',
    types: '',
    startDate: '',
    endDate: '',
    status: '',
    id: '',
  };
  heCanTakeAction: any;
  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private employeesService: EmployeesService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<LeaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe
  ) {
    // Initialize the FormGroup with conditional validators
    this.employeeForm = this.fb.group({
      employee: ['', Validators.required],
      types: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  
    this.heCanTakeAction = this.authService.canRegisterUser();
  
    if (this.heCanTakeAction) {
      this.employeeForm.addControl('status', this.fb.control('', Validators.required));
    }
  }
  
  ngOnInit(): void {
    this.loadEmployees();
    this.heCanTakeAction = this.authService.canRegisterUser();
    if (this.data.action === 'edit' && this.data.leave) {
      this.leave = { ...this.data.leave };
      this.employeeForm.patchValue({
        employee: this.leave.employee,
        types: this.leave.types,
        status: this.leave.status,
        startDate: this.leave.startDate,
        endDate: this.leave.endDate,
      });
    }
  }

  private loadEmployees(): void {
    this.employeesService.getAllEmployees().subscribe(
      (employees: Employee[]) => {
        this.employees = employees;
      },
    );
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.leave = { ...this.leave, ...this.employeeForm.value };
      this.leave.startDate = this.datePipe.transform(this.leave.startDate, 'yyyy-MM-dd') || '';
      this.leave.endDate = this.datePipe.transform(this.leave.endDate, 'yyyy-MM-dd') || '';

      if (this.data.action === 'add') {
        this.leaveService.addLeaveRequest(this.leave).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else if (this.data.action === 'edit' && this.leave.id) {
        this.leaveService.updateLeaveRequest(this.leave.id, this.leave).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    } else {
      // Trigger validation messages or other feedback for the user
      this.employeeForm.markAllAsTouched(); // Mark all fields as touched to display validation messages
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
