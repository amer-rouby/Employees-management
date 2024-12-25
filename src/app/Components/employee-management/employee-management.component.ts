import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Employee } from '../../Models/employee.model';
import { DialogService } from '../../Services/dialog.service';
import { EmployeeDialogComponent } from './employee-add-dialog/employee-dialog.component';
import { EmployeeDetailsDialogComponent } from '../../Dialogs/employee-details-dialog/employee-details-dialog.component';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { EmployeesService } from '../../Services/employee-management.service';
import { departments, gender, maritalStatus } from '../../constants/data.constants';
import { JobTitlesService } from '../../Services/JobTitles.service';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss']
})
export class EmployeeManagementComponent implements OnInit {
  employees: Employee[] = [];
  displayedColumns: string[] = ['name', 'jobTitle', 'department', 'actions'];
  dataSource = new MatTableDataSource<Employee>(this.employees);
  columnDefinitions: any[] = [];
  isLoading = false;
  showViewAction: boolean = true;
  jobTitles:any;
  constants = { departments, gender, maritalStatus};

  constructor(
    private dialogService: DialogService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private employeesService: EmployeesService,
    private jobTitlesService: JobTitlesService,
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.setupColumnDefinitions();
    this.fetchJobTitles();
  }
  
  fetchJobTitles(): void {
    this.jobTitlesService.getAllJobTitlesRequests().subscribe(data => {
      this.jobTitles = data;
    });
  }
  private loadEmployees(): void {
    this.toggleLoading(true);
    this.employeesService.getAllEmployees().subscribe(
      employees => this.handleLoadSuccess(employees),
      error => this.handleError('Failed to load employees', error)
    );
  }

  private handleLoadSuccess(employees: Employee[]): void {
    this.employees = employees;
    this.dataSource.data = employees;
    this.toggleLoading(false);
  }

  openDialog(employee?: Employee): void {
    this.dialogService.openDialog(EmployeeDialogComponent, employee || null).subscribe(result => {
      if (result) {
        employee ? this.updateEmployee(result) : this.addEmployee(result);
      }
    });
  }

  viewEmployeeDetails(employee: Employee): void {
    this.dialogService.openDialog(EmployeeDetailsDialogComponent, employee).subscribe();
  }

  private addEmployee(employee: Employee): void {
    this.toggleLoading(true);
    this.employeesService.addEmployee(employee).subscribe(
      newEmployee => {
        this.employees.push(newEmployee);
        this.dataSource.data = [...this.employees];
        this.showToast('employeeAdded');
      },
      error => this.handleError('Failed to add employee', error)
    );
  }

  private updateEmployee(updatedEmployee: Employee): void {
    this.toggleLoading(true);
    this.employeesService.updateEmployee(updatedEmployee.id, updatedEmployee).subscribe(
      () => {
        this.updateEmployeeList(updatedEmployee);
        this.showToast('employeeUpdated');
      },
      error => this.handleError('Failed to update employee', error)
    );
  }

  private updateEmployeeList(updatedEmployee: Employee): void {
    const index = this.employees.findIndex(emp => emp.id === updatedEmployee.id);
    if (index !== -1) {
      this.employees[index] = updatedEmployee;
      this.dataSource.data = [...this.employees];
    }
  }

  confirmDelete(id: string): void {
    this.dialogService.openDialog(ConfirmDeleteDialogComponent, {}, '400px').subscribe(result => {
      if (result) {
        this.deleteEmployee(+id);
      }
    });
  }

  deleteEmployee(id: number): void {
    this.toggleLoading(true);
    this.employeesService.deleteEmployee(id.toString()).subscribe(
      () => {
        this.employees = this.employees.filter(emp => emp.id !== id.toString());
        this.dataSource.data = [...this.employees];
        this.showToast('employeeDeleted');
      },
      error => this.handleError('Failed to delete employee', error)
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  private setupColumnDefinitions(): void {
    this.translate
      .get(['NAME', 'POSITION', 'DEPARTMENT', 'GENDER', 'ACTIONS'])
      .subscribe(translations => {
        this.columnDefinitions = [
          {
            key: 'name',
            header: 'NAME',
            cell: (employee: Employee) => this.translate.currentLang === 'ar' ? employee.name : employee.englishName
          },
          {
            key: 'jobTitle',
            header: 'POSITION',
            cell: (employee: Employee) => this.getTranslatedValue('jobTitles' , employee.jobTitleId)
          },
          {
            key: 'department',
            header: 'DEPARTMENT',
            cell: (employee: Employee) => this.getTranslatedValue('departments', employee.departmentId)
          },
          { key: 'actions', header: 'ACTIONS', cell: () => '' }
        ];
      });
  }

  private getTranslatedValue(key: keyof typeof this.constants | 'jobTitles', id: number): string {
    const collection = key === 'jobTitles' ? this.jobTitles : this.constants[key];
    if (!collection || !Array.isArray(collection)) return 'Unknown';
    const item = collection.find(i => i.id === id);
    return item ? (this.translate.currentLang === 'ar' ? item.arabic : item.english) : 'Unknown';
  }
  

  private handleError(message: string, error: any): void {
    console.error(error);
    this.toastr.error(message, 'Error');
    this.toggleLoading(false);
  }

  private showToast(key: string): void {
    this.translate.get(key).subscribe(message => {
      this.toastr.success(message, 'Success');
    });
    this.toggleLoading(false);
  }

  private toggleLoading(state: boolean): void {
    this.isLoading = state;
  }
}
