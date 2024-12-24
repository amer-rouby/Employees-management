import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../../Models/employee.model';
import { jobTitles, departments, gender, nationalities, maritalStatus } from '../../constants/data.constants';
import { PdfService } from '../../Services/pdf.service';

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
  isShow = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public employee: Employee,
    private dialogRef: MatDialogRef<EmployeeDetailsDialogComponent>,
    private pdfService: PdfService
  ) {}

  getLookupValueById(lookupArray: any[], id: any, language = 'english'): string {
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
