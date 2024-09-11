import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../../Models/employee.model';
import { jobTitles, departments, gender, nationalities, maritalStatus } from '../../constants/data.constants';

@Component({
  selector: 'app-employee-details-dialog',
  templateUrl: './employee-details-dialog.component.html',
  styleUrls: ['./employee-details-dialog.component.scss']
})
export class EmployeeDetailsDialogComponent {
  jobTitles = jobTitles;
  departments = departments;
  gender = gender;
  nationalities = nationalities;
  maritalStatus = maritalStatus;

  constructor(
    @Inject(MAT_DIALOG_DATA) public employee: Employee,
    private dialogRef: MatDialogRef<EmployeeDetailsDialogComponent> // Inject MatDialogRef
  ) { }

  getJobTitleById(id: any): string {
    return this.getLookupValue(this.jobTitles, id);
  }

  getDepartmentById(id: any): string {
    return this.getLookupValue(this.departments, id);
  }

  getGenderById(id: any): string {
    return this.getLookupValue(this.gender, id);
  }

  getNationalitieById(id: any): string {
    return this.getLookupValue(this.nationalities, id);
  }

  getMaritalStatusById(id: any): string {
    return this.getLookupValue(this.maritalStatus, id);
  }

  private getLookupValue(lookupArray: any[], id: any): string {
    const item = lookupArray.find(i => i.id === id);
    return item ? item.arabic : 'غير معروف';
  }

  // Function to close the dialog
  closeDialog(): void {
    this.dialogRef.close();
  }
}
