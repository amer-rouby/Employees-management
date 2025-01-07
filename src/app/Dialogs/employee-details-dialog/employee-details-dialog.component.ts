import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../../Models/employee.model';
import { PdfService } from '../../Services/pdf.service';
import { NationalitiesService } from '../../Services/nationalities.service';
import { JobTitlesService } from '../../Services/JobTitles.service';
import { DepartmentsService } from '../../Services/departments.service';
import { JobTitles } from '../../Models/JobTitles.model';
import { Departments } from '../../Models/departments.model';
import { Nationalities } from '../../Models/nationalities.model';
import { Gender } from '../../Models/gender.model';
import { MaritalStatus } from '../../Models/maritalStatus.model';
import { GenderService } from '../../Services/gender.service';
import { MaritalStatusService } from '../../Services/maritalStatus.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-employee-details-dialog',
  templateUrl: './employee-details-dialog.component.html',
  styleUrls: ['./employee-details-dialog.component.scss']
})
export class EmployeeDetailsDialogComponent implements OnInit {
  jobTitles: JobTitles[] = [];
  departments: Departments[] = [];
  gender: Gender[] = [];
  nationalities: Nationalities[] = [];
  maritalStatus: MaritalStatus[] = [];
  isShow = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public employee: Employee,
    private dialogRef: MatDialogRef<EmployeeDetailsDialogComponent>,
    private pdfService: PdfService,
    private nationalitiesService: NationalitiesService,
    private jobTitlesService: JobTitlesService,
    private departmentsService: DepartmentsService,
    private genderService: GenderService,
    private maritalStatusService: MaritalStatusService
  ) { }

  ngOnInit(): void {
    // Fetching all the necessary data for dropdowns
    this.fetchData([
      { method: this.nationalitiesService.getAllNationalitiesRequests(), setter: (data: Nationalities[]) => this.nationalities = data },
      { method: this.jobTitlesService.getAllJobTitlesRequests(), setter: (data: JobTitles[]) => this.jobTitles = data },
      { method: this.departmentsService.getAllDepartmentsRequests(), setter: (data: Departments[]) => this.departments = data },
      { method: this.genderService.getAllGenderRecords(), setter: (data: Gender[]) => this.gender = data },
      { method: this.maritalStatusService.getAllMaritalStatus(), setter: (data: MaritalStatus[]) => this.maritalStatus = data }
    ]);
  }

  // General method to fetch data and set it
  private fetchData(services: { method: Observable<any>, setter: (data: any) => void }[]): void {
    services.forEach(service => {
      service.method.subscribe(service.setter);
    });
  }

  // Utility method to get the translated value based on id
  getLookupValueById(lookupArray: any[], id: any, language = 'english'): string {
    const item = lookupArray.find(i => i.id === id);
    return item ? item[language] : '';
  }

  // Close the dialog
  closeDialog(): void {
    this.dialogRef.close();
  }

  // Print the employee details as PDF
  printPDF(): void {
    this.isShow = false;
    setTimeout(() => {
      const fileName = `${this.employee.englishName?.replace(/ /g, '_') || 'employee'}_details.pdf`;
      this.pdfService.generatePdf('employeeDetails', fileName);
      this.closeDialog();
    }, 100);
  }
}
