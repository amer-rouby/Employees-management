import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../../../Models/employee.model';
import { NationalitiesService } from '../../../Services/nationalities.service';
import { DepartmentsService } from '../../../Services/departments.service';
import { TranslateService } from '@ngx-translate/core';
import { GenderService } from '../../../Services/gender.service';
import { MaritalStatusService } from '../../../Services/maritalStatus.service';
import { DropdownItem } from '../../../Models/dropdown.model';
import { JobTitlesService } from '../../../Services/JobTitles.service';

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  styleUrls: ['./employee-dialog.component.scss']
})
export class EmployeeDialogComponent implements OnInit {
  isEditMode: boolean;
  fields: any[] = [];
  formData: any = {};
  jobTitles: DropdownItem[] = [];
  departments: DropdownItem[] = [];
  nationalities: DropdownItem[] = [];
  maritalStatus: DropdownItem[] = [];
  gender: DropdownItem[] = [];

  constructor(
    private translate: TranslateService,
    private nationalitiesService: NationalitiesService,
    private jobTitlesService: JobTitlesService,
    private departmentsService: DepartmentsService,
    private genderService: GenderService,
    private maritalStatusService: MaritalStatusService,
    private dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Employee
  ) {
    this.isEditMode = !!data;
  }

  ngOnInit(): void {
    this.initializeFields();
    this.loadDropdownData();
    this.formData = this.isEditMode ? { ...this.data } : {}; // Ensure formData is initialized properly
  }

  // Initialize the form fields structure
  private initializeFields(): void {
    this.fields = [
      { name: 'name', label: 'NAME', type: 'text', required: true },
      { name: 'englishName', label: 'ENGLISH_NAME', type: 'text', required: true },
      { name: 'departmentId', label: 'DEPARTMENT', type: 'select', required: true, options: this.departments },
      { name: 'jobTitleId', label: 'JOB_NAMES', type: 'select', required: true, options: this.jobTitles },
      { name: 'genderId', label: 'GENDER', type: 'select', required: true, options: this.gender },
      { name: 'nationalitieId', label: 'NATIONALITY', type: 'select', required: true, options: this.nationalities },
      { name: 'maritalStatusId', label: 'MARITAL_STATUS', type: 'select', required: true, options: this.maritalStatus },
      { name: 'phoneNumber', label: 'PHONE_NUMBER', type: 'text', required: true, pattern: '^\\+?[0-9]{10,12}$' },
      { name: 'identityNumber', label: 'IDENTITY_NUMBER', type: 'text', required: true, pattern: '^[0-9]{6,11}$' },
      { name: 'hireDate', label: 'HIRE_DATE', type: 'date', required: true },
    ];
  }

  // Load dropdown data (nationalities, job titles, departments, gender, marital status)
  private loadDropdownData(): void {
    const services = [
      { method: this.nationalitiesService.getAllNationalitiesRequests(), setter: (data: DropdownItem[]) => this.nationalities = this.mapDropdownData(data) },
      { method: this.jobTitlesService.getAllJobTitlesRequests(), setter: (data: DropdownItem[]) => this.jobTitles = this.mapDropdownData(data) },
      { method: this.genderService.getAllGenderRecords(), setter: (data: DropdownItem[]) => this.gender = this.mapDropdownData(data) },
      { method: this.maritalStatusService.getAllMaritalStatus(), setter: (data: DropdownItem[]) => this.maritalStatus = this.mapDropdownData(data) },
      { method: this.departmentsService.getAllDepartmentsRequests(), setter: (data: DropdownItem[]) => this.departments = this.mapDropdownData(data) }
    ];

    services.forEach(service => {
      service.method.subscribe((data: DropdownItem[]) => {
        service.setter(data);
        this.checkDataReady();
      });
    });
  }

  // Map data to be language-specific
  private mapDropdownData(data: DropdownItem[]): any[] {
    return data.map(item => ({
      id: item.id,
      name: this.translate.currentLang === 'ar' ? item.arabic : item.english
    }));
  }

  // Check if all data for dropdowns is ready
  private checkDataReady(): void {
    if (this.nationalities.length && this.jobTitles.length && this.departments.length && this.gender.length && this.maritalStatus.length) {
      this.initializeFields(); // Reinitialize fields once data is ready
    }
  }

  // Save the employee form data
  saveEmployee(formData: any): void {
    if (this.isEditMode && this.formData.id) {
      formData.id = this.formData.id; // Add ID for edit mode
    }
    this.dialogRef.close(formData); // Close the dialog and send form data back
  }

  // Cancel the dialog without saving
  cancel(): void {
    this.dialogRef.close();
  }
}
