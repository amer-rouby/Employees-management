import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../../../Models/employee.model';
import { jobTitles, departments, gender, nationalities, maritalStatus } from '../../../constants/data.constants';

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
    @Inject(MAT_DIALOG_DATA) public data: Employee,
  ) {
    this.isEditMode = !!data;
    this.employeeForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      englishName: ['', Validators.required],
      departmentId: ['', Validators.required],
      jobTitleId: ['', Validators.required],
      genderId: ['', Validators.required],
      nationalitieId: ['', Validators.required],
      maritalStatusId: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{10,12}$')]],
      identityNumber: ['', [Validators.required, Validators.pattern('^[0-9]{6,11}$')]],
      hireDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data) {
      this.employeeForm.patchValue(this.data);
    }
  }

  saveEmployee(): void {
    if (this.employeeForm.valid) {
      this.dialogRef.close(this.employeeForm.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
