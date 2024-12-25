import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../../../Models/employee.model';
import { jobTitles, departments, gender, maritalStatus } from '../../../constants/data.constants';
import { NationalitiesService } from '../../../Services/nationalities.service';
import { JobTitlesService } from '../../../Services/JobTitles.service';

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  styleUrls: ['./employee-dialog.component.scss']
})
export class EmployeeDialogComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode: boolean;

  jobTitles :any;
  departments = departments;
  gender = gender;
  nationalities:any;
  maritalStatus = maritalStatus;

  constructor(
    private fb: FormBuilder,
    private nationalitiesService: NationalitiesService,
    private jobTitlesService: JobTitlesService,
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
    this.fetchNationalities()
    this.fetchJobTitles()
    if (this.isEditMode && this.data) {
      this.employeeForm.patchValue(this.data);
    }
  }

  fetchNationalities(): void {
    this.nationalitiesService.getAllNationalitiesRequests().subscribe(data => {
      this.nationalities = data;
      console.log(this.nationalities);
      
    });
  }

  fetchJobTitles(): void {
    this.jobTitlesService.getAllJobTitlesRequests().subscribe(data => {
      this.jobTitles = data;
    });
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
