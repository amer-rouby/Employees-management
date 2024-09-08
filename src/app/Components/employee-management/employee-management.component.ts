import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from '../../Models/employee.model';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { departments, gender, jobTitles } from '../../Lookup-code/Lookup-code';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { EmployeesService } from '../../Services/employee-management.service';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss']
})
export class EmployeeManagementComponent implements OnInit, AfterViewInit {
  employees: Employee[] = [];
  displayedColumns: string[] = ['name', 'jobTitle', 'department', 'gender', 'actions'];
  dataSource = new MatTableDataSource<Employee>(this.employees);
  columnDefinitions = [
    { key: 'name', header: 'NAME', cell: (employee: Employee) => employee.name },
    { key: 'jobTitle', header: 'POSITION', cell: (employee: Employee) => this.getJobTitleById(employee.jobTitleId ?? '') },
    { key: 'department', header: 'DEPARTMENT', cell: (employee: Employee) => this.getDepartmentById(employee.departmentId ?? '') },
    { key: 'gender', header: 'GENDER', cell: (employee: Employee) => this.getGenderById(employee.genderId ?? '') },
    { key: 'actions', header: 'ACTIONS', cell: () => '' }
  ];
  jobTitles = jobTitles;
  departments = departments;
  gender = gender;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService,
    private employeesService: EmployeesService
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  loadEmployees(): void {
    this.employeesService.getAllEmployees().subscribe(employees => {
      this.employees = employees;
      this.dataSource.data = [...this.employees];
    });
  }

  openDialog(employee?: Employee): void {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '600px',
      data: employee
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (employee) {
          this.updateEmployee(result);
        } else {
          this.addEmployee(result);
        }
      }  
    });
  }

  addEmployee(employee: Employee): void {
    this.employeesService.addEmployees(employee).subscribe(newEmployee => {
      this.employees.push(newEmployee);
      this.dataSource.data = [...this.employees];
      this.translate.get('employeeAdded').subscribe((message: string) => {
        this.toastr.success(message, 'Success');
      });
    });
  }

  updateEmployee(updatedEmployee: Employee): void {
    this.employeesService.updateEmployees(updatedEmployee.id, updatedEmployee).subscribe(() => {
      const index = this.employees.findIndex(emp => emp.id === updatedEmployee.id);
      if (index !== -1) {
        this.employees[index] = updatedEmployee;
        this.dataSource.data = [...this.employees];
      }
      this.translate.get('employeeUpdated').subscribe((message: string) => {
        this.toastr.success(message, 'Success');
      });
    });
  }

  deleteEmployee(id: any): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeesService.deleteEmployees(id).subscribe(() => {
          this.employees = this.employees.filter(emp => emp.id !== id);
          this.dataSource.data = [...this.employees];
          this.translate.get('employeeDeleted').subscribe((message: string) => {
            this.toastr.success(message, 'Success');
          });
        });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getJobTitleById(id: any): any {
    const job = this.jobTitles.find(j => j.id === id);
    return job ? job.arabic : 'غير معروف';
  }

  getGenderById(id: any): any {
    const gend = this.gender.find(g => g.id === id);
    return gend ? gend.arabic : 'غير معروف';
  }

  getDepartmentById(id: any): any {
    const department = this.departments.find(d => d.id === id);
    return department ? department.arabic : 'غير معروف';
  }
}
