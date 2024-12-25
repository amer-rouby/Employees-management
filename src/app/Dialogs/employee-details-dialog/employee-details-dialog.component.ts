import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../../Models/employee.model';
import {gender, maritalStatus } from '../../constants/data.constants';
import { PdfService } from '../../Services/pdf.service';
import { NationalitiesService } from '../../Services/nationalities.service';
import { JobTitlesService } from '../../Services/JobTitles.service';
import { DepartmentsService } from '../../Services/departments.service';
import { JobTitles } from '../../Models/JobTitles.model';
import { Departments } from '../../Models/departments.model';
import { Nationalities } from '../../Models/nationalities.model';

@Component({
  selector: 'app-employee-details-dialog',
  templateUrl: './employee-details-dialog.component.html',
  styleUrls: ['./employee-details-dialog.component.scss']
})
export class EmployeeDetailsDialogComponent implements OnInit{
  jobTitles : JobTitles[]=[];
  departments : Departments[]=[];
  gender = gender;
  nationalities :Nationalities[]=[];
  maritalStatus = maritalStatus;
  isShow = true;
  ngOnInit(): void {
    this.fetchNationalities()
    this.fetchJobTitles()
    this.fetchDepartments()
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public employee: Employee,
    private dialogRef: MatDialogRef<EmployeeDetailsDialogComponent>,
    private pdfService: PdfService,
    private nationalitiesService: NationalitiesService,
    private jobTitlesService: JobTitlesService,
    private departmentsService: DepartmentsService,
  ) {}

  getLookupValueById(lookupArray: any[], id: any, language = 'english'): string {
    if (!Array.isArray(lookupArray)) {
      return '';
    }
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
  fetchDepartments(): void {
    this.departmentsService.getAllDepartmentsRequests().subscribe(data => {
      this.departments = data;
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
