import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../../Models/employee.model';
import { PdfService } from '../../Services/pdf.service';
import { JobTitles } from '../../Models/JobTitles.model';
import { Departments } from '../../Models/departments.model';
import { Nationalities } from '../../Models/nationalities.model';
import { Gender } from '../../Models/gender.model';
import { MaritalStatus } from '../../Models/maritalStatus.model';
import { DataService } from '../../Services/Data.service';

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
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  private fetchData(): void {
    this.dataService.getNationalities().subscribe(data => this.nationalities = data);
    this.dataService.getJobTitles().subscribe(data => this.jobTitles = data);
    this.dataService.getDepartments().subscribe(data => this.departments = data);
    this.dataService.getGender().subscribe(data => this.gender = data);
    this.dataService.getMaritalStatus().subscribe(data => this.maritalStatus = data);
  }

  getLookupValueById(lookupArray: any[], id: any, language = 'english'): string {
    if (!Array.isArray(lookupArray)) {
      return '';
    }
    const item = lookupArray.find((i) => i.id === id);
    return item ? item[language] : '';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  printPDF(): void {
    this.isShow = false;
    setTimeout(() => {
      const fileName = `${this.employee.englishName?.replace(/ /g, '_') || 'employee'}_details.pdf`;
      this.pdfService.generatePdf('employeeDetails', fileName);
      this.closeDialog();
    }, 100);
  }
}
