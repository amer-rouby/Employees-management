import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../../../Models/employee.model';
import { departments, gender, jobTitles } from '../../../Lookup-code/Lookup-code'; // تأكد من استيراد gender بشكل صحيح

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
  gender = gender; // تأكد من أن gender يتم تعيينه هنا

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Employee
  ) {
    this.employeeForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      departmentId: ['', Validators.required],
      jobTitleId: ['', Validators.required],
      genderId: ['', Validators.required],
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
