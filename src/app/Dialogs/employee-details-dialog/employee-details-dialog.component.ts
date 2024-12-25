import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../../Models/employee.model';
import { jobTitles, departments, gender, maritalStatus } from '../../constants/data.constants';
import { PdfService } from '../../Services/pdf.service';
import { NationalitiesService } from '../../Services/nationalities.service';
import { JobTitlesService } from '../../Services/JobTitles.service';

@Component({
  selector: 'app-employee-details-dialog',
  templateUrl: './employee-details-dialog.component.html',
  styleUrls: ['./employee-details-dialog.component.scss']
})
export class EmployeeDetailsDialogComponent implements OnInit{
  jobTitles : any;
  departments = departments;
  gender = gender;
  nationalities :any;
  maritalStatus = maritalStatus;
  isShow = true;
  ngOnInit(): void {
    this.fetchNationalities()
    this.fetchJobTitles()
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public employee: Employee,
    private dialogRef: MatDialogRef<EmployeeDetailsDialogComponent>,
    private pdfService: PdfService,
    private nationalitiesService: NationalitiesService,
    private jobTitlesService: JobTitlesService
  ) {}

  getLookupValueById(lookupArray: any[], id: any, language = 'english'): string {
    const item = lookupArray.find((i) => i.id === id);
    return item ? item[language] : '';
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
