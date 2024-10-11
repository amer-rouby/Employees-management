import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from '../../Models/employee.model';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { departments, gender, jobTitles } from '../../Lookup-code/Lookup-code';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';

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
    { key: 'jobTitle', header: 'POSITION', cell: (employee: Employee) => this.getJobTitleById(employee.jobTitleId ?? -1) },
    { key: 'department', header: 'DEPARTMENT', cell: (employee: Employee) => this.getDepartmentById(employee.departmentId ?? -1) },
    { key: 'gender', header: 'GENDER', cell: (employee: Employee) => this.getGenderById(employee.genderId ?? -1) },
    { key: 'actions', header: 'ACTIONS', cell: () => '' }
  ];
  jobTitles = jobTitles;
  departments = departments;
  gender = gender;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  loadEmployees(): void {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      this.employees = JSON.parse(storedEmployees);
    } else {
      this.employees = [];
    }
    this.dataSource.data = [...this.employees];
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
    employee.id = this.getNextEmployeeId();
    this.employees.push(employee);
    localStorage.setItem('employees', JSON.stringify(this.employees));
    this.dataSource.data = [...this.employees];
  }

  updateEmployee(updatedEmployee: Employee): void {
    const index = this.employees.findIndex(emp => emp.id === updatedEmployee.id);
    if (index !== -1) {
      this.employees[index] = updatedEmployee;
      localStorage.setItem('employees', JSON.stringify(this.employees));
      this.dataSource.data = [...this.employees];
    }
  }

  deleteEmployee(id: number | undefined): void {
    if (id !== undefined) {
      const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
        width: '400px',
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.employees = this.employees.filter(emp => emp.id !== id);
          localStorage.setItem('employees', JSON.stringify(this.employees));
          this.dataSource.data = [...this.employees];
        }
      });
    }
  }
  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private getNextEmployeeId(): number {
    return this.employees.length > 0 ? Math.max(...this.employees.map(emp => emp.id)) + 1 : 1;
  }

  getJobTitleById(id: number): string {
    const job = this.jobTitles.find(j => j.id === id);
    return job ? job.arabic : 'غير معروف';
  }

  getGenderById(id: number): string {
    const gend = this.gender.find(g => g.id === id);
    return gend ? gend.arabic : 'غير معروف';
  }

  getDepartmentById(id: number): string {
    const department = this.departments.find(d => d.id === id);
    return department ? department.arabic : 'غير معروف';
  }
}
