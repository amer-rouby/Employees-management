import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../../../Models/employee.model';
import { departments, gender, jobTitles, nationalities, maritalStatus } from '../../../constants/data.constants';

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  styleUrls: ['./employee-dialog.component.scss']
})
export class EmployeeDialogComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode: boolean;

  jobTitles = jobTitles;
  departments = departments;
  gender = gender;
  nationalities = nationalities;
  maritalStatus = maritalStatus;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Employee
  ) {
    this.employeeForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      departmentId: ['', Validators.required],
      jobTitleId: ['', Validators.required],
      genderId: ['', Validators.required],
      nationalitieId: ['', Validators.required],
      maritalStatusId: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{10,15}$')]], // الحقل الجديد
      identityNumber: ['', [Validators.required, Validators.pattern('^[0-9]{6,15}$')]], // الحقل الجديد
      hireDate: ['', Validators.required] // الحقل الجديد
    });

    this.isEditMode = !!data;
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data) {
      this.employeeForm.patchValue({
        id: this.data.id,
        name: this.data.name,
        jobTitleId: this.data.jobTitleId ?? '',
        departmentId: this.data.departmentId ?? '',
        genderId: this.data.genderId ?? '',
        nationalitieId: this.data.nationalitieId ?? '',
        maritalStatusId: this.data.maritalStatusId ?? '',
        phoneNumber: this.data.phoneNumber ?? '', // إضافة القيم الافتراضية
        identityNumber: this.data.identityNumber ?? '', // إضافة القيم الافتراضية
        hireDate: this.data.hireDate ?? '' // إضافة القيم الافتراضية
      });
    }
  }

  saveEmployee(): void {
    if (this.employeeForm.valid) {
      const employee: Employee = this.employeeForm.value;
      this.dialogRef.close(employee);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
