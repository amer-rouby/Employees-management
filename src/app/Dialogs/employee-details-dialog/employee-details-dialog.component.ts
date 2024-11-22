import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../../Models/employee.model';
import { jobTitles, departments, gender, nationalities, maritalStatus } from '../../constants/data.constants';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
  isShow:boolean = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public employee: Employee,
    private dialogRef: MatDialogRef<EmployeeDetailsDialogComponent>
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
    return item ? item.english : 'غير معروف';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  printPDF(): void {
    this.isShow = false;
    setTimeout(() => {
      const data = document.getElementById('employeeDetails');
      if (data) {
        html2canvas(data, { 
          scale: 2,
          useCORS: true,
          scrollY: -window.scrollY 
        }).then(canvas => {
          const imgWidth = 190;
          const pageHeight = 290; 
          const imgHeight = canvas.height * imgWidth / canvas.width;
          let heightLeft = imgHeight;
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
  
          const margin = 10;
          pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
          heightLeft -= pageHeight;
  
          while (heightLeft >= 0) {
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
  
          // Generate the file name using the employee's name
          const fileName = `${this.employee.englishName!.replace(/ /g, '_')}_details.pdf`;
          pdf.save(fileName);
        }).catch(err => console.error('Error generating PDF:', err));
      }
      this.closeDialog();
    }, 200);
  }
  
}
