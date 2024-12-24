import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LeaveService } from '../../../Services/leave.service';
import { EmployeesService } from '../../../Services/employee-management.service';
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
  employeeForm!: FormGroup;
  leave!: Leave;
  heCanTakeAction: boolean;

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private employeesService: EmployeesService,
    private permissionsService: PermissionsService,
    private dialogRef: MatDialogRef<LeaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { action: 'add' | 'edit'; leave?: Leave },
    private datePipe: DatePipe,
    public translate: TranslateService
  ) {
    this.heCanTakeAction = this.permissionsService.canRegisterUser();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadEmployees();

    if (this.data.action === 'edit' && this.data.leave) {
      this.leave = { ...this.data.leave };
      this.employeeForm.patchValue(this.leave);
    }
  }

  private initializeForm(): void {
    const controls: any = {
      name: ['', Validators.required],
      englishName: ['', Validators.required],
      types: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    };

    if (this.heCanTakeAction) {
      controls.status = ['', Validators.required];
    }

    this.employeeForm = this.fb.group(controls);
  }

  private loadEmployees(): void {
    this.employeesService.getAllEmployees().subscribe({
      next: (employees: Employee[]) => (this.employees = employees),
      error: (err) => console.error('Failed to load employees:', err),
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const leaveData = this.prepareLeaveData();

    const request$: Observable<any> =
      this.data.action === 'add'
        ? this.leaveService.addLeaveRequest(leaveData)
        : this.leaveService.updateLeaveRequest(leaveData.id!, leaveData);

    request$.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => console.error('Failed to process leave request:', err),
    });
  }

  private prepareLeaveData(): Leave {
    const formValue = this.employeeForm.value;

    return {
      ...this.leave,
      ...formValue,
      startDate: this.datePipe.transform(formValue.startDate, 'yyyy-MM-dd') || '',
      endDate: this.datePipe.transform(formValue.endDate, 'yyyy-MM-dd') || '',
    };
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
