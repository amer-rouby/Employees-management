import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from '../../Models/employee.model';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { EmployeeDialogComponent } from './employee-add-dialog/employee-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { EmployeesService } from '../../Services/employee-management.service';
import { EmployeeDetailsDialogComponent } from '../../Dialogs/employee-details-dialog/employee-details-dialog.component';
import { departments, gender, jobTitles, maritalStatus, nationalities } from '../../constants/data.constants';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss']
})
export class EmployeeManagementComponent implements OnInit {
  employees: Employee[] = [];
  displayedColumns: string[] = ['name', 'jobTitle', 'department','actions'];
  dataSource = new MatTableDataSource<Employee>(this.employees);
  columnDefinitions: any[] = [];
  isLoading: boolean = false;
  showViowAction: boolean = true;
  jobTitles = jobTitles;
  departments = departments;
  gender = gender;
  nationalities = nationalities;
  maritalStatus = maritalStatus;

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService,
    private employeesService: EmployeesService
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
    this.setupColumnDefinitions();
  }

  private loadEmployees(): void {
    this.isLoading = true;
    this.employeesService.getAllEmployees().subscribe(
      employees => this.handleSuccess(employees),
      error => this.handleError('Failed to load employees', error)
    );
  }

  private handleSuccess(employees: Employee[] | Employee): void {
    if (Array.isArray(employees)) {
      this.employees = employees;
      this.dataSource.data = [...this.employees];
    }
    this.isLoading = false;
  }

  private handleError(message: string, error: any): void {
    this.toastr.error(message, 'Error');
    console.error(message, error);
    this.isLoading = false;
  }

  openDialog(employee?: Employee): void {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '600px',
      data: employee
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        employee ? this.updateEmployee(result) : this.addEmployee(result);
      }
    });
  }

  viewEmployeeDetails(employee: Employee): void {
    this.dialog.open(EmployeeDetailsDialogComponent, {
      width: '600px',
      data: employee
    });
  }

  private addEmployee(employee: Employee): void {
    this.isLoading = true;
    this.employeesService.addEmployees(employee).subscribe(
      newEmployee => {
        this.employees.push(newEmployee);
        this.dataSource.data = [...this.employees];
        this.showSuccess('employeeAdded');
        this.loadEmployees();
      },
      error => this.handleError('Failed to add employee', error)
    );
  }

  private updateEmployee(updatedEmployee: Employee): void {
    this.isLoading = true;
    this.employeesService.updateEmployees(updatedEmployee.id, updatedEmployee).subscribe(
      () => {
        const index = this.employees.findIndex(emp => emp.id === updatedEmployee.id);
        if (index !== -1) {
          this.employees[index] = updatedEmployee;
          this.dataSource.data = [...this.employees];
          this.showSuccess('employeeUpdated');
        }
        
      },
      error => this.handleError('Failed to update employee', error)
    );
  }

  deleteEmployee(id: any): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.employeesService.deleteEmployees(id).subscribe(
          () => {
            this.employees = this.employees.filter(emp => emp.id !== id);
            this.dataSource.data = [...this.employees];
            this.showSuccess('employeeDeleted');
          },
          error => this.handleError('Failed to delete employee', error)
        );
      }
    });
  }

  private showSuccess(key: string): void {
    this.translate.get(key).subscribe(message => {
      this.toastr.success(message, 'Success');
    });
    this.isLoading = false;
  }

  applyFilter(event: Event): void {
    this.isLoading = true;
    if (event) {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.dataSource.filter = filterValue;
      setTimeout(() => {
        this.isLoading = false;
      }, 200); 
    }
  }

  private setupColumnDefinitions(): void {
    this.translate.get(['JOB_TITLES', 'DEPARTMENTS', 'GENDERS', 'NATIONALITIES', 'MARITAL_STATUSES']).subscribe(translations => {
      this.columnDefinitions = [
        { key: 'name', header: 'NAME', cell: (employee: Employee) => this.translate.currentLang === 'ar' ? employee.name : employee.englishName },
        { key: 'jobTitle', header: 'POSITION', cell: (employee: Employee) => this.getTranslationForKey('jobTitles', employee.jobTitleId) },
        { key: 'department', header: 'DEPARTMENT', cell: (employee: Employee) => this.getTranslationForKey('departments', employee.departmentId) },
        { key: 'gender', header: 'GENDER', cell: (employee: Employee) => this.getTranslationForKey('gender', employee.genderId) },
        { key: 'nationalities', header: 'NATIONALITIE', cell: (employee: Employee) => this.getTranslationForKey('nationalities', employee.nationalitieId) },
        { key: 'maritalStatus', header: 'MARITAL_STATUS', cell: (employee: Employee) => this.getTranslationForKey('maritalStatus', employee.maritalStatusId) },
        { key: 'actions', header: 'ACTIONS', cell: () => '' }
      ];
    });
  }

  private getTranslationForKey(key: 'jobTitles' | 'departments' | 'gender' | 'nationalities' | 'maritalStatus', id: any): string {
    const data = this[key] as { id: any, arabic: string, english: string }[];
    const item = data.find(i => i.id === id);
    return item ? this.translate.currentLang === 'ar' ? item.arabic : item.english : 'Unknown';
  }
}
