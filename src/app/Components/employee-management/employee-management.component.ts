import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from '../../Models/employee.model';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { departments, gender, jobTitles } from '../../Lookup-code/Lookup-code';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss']
})
export class EmployeeManagementComponent implements OnInit {
  employees: Employee[] = [];
  displayedColumns: string[] = ['name', 'jobTitle', 'department', "gender", 'actions'];
  dataSource = new MatTableDataSource<Employee>(this.employees);

  jobTitles = jobTitles;
  departments = departments;
  gender = gender;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadEmployees(): void {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      this.employees = JSON.parse(storedEmployees);
      this.dataSource.data = [...this.employees];
    }
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
    const storedEmployees = localStorage.getItem('employees');
    let employees: Employee[] = storedEmployees ? JSON.parse(storedEmployees) : [];
    employee.id = this.getNextEmployeeId();
    employees.push(employee);

    // Save updated list to localStorage
    localStorage.setItem('employees', JSON.stringify(employees));

    // Update dataSource
    this.dataSource.data = [...employees];
  }

  updateEmployee(updatedEmployee: Employee): void {
    const storedEmployees = localStorage.getItem('employees');
    let employees: Employee[] = storedEmployees ? JSON.parse(storedEmployees) : [];
    const index = employees.findIndex(emp => emp.id === updatedEmployee.id);
    if (index !== -1) {
      employees[index] = updatedEmployee;

      // Save updated list to localStorage
      localStorage.setItem('employees', JSON.stringify(employees));

      // Update dataSource
      this.dataSource.data = [...employees];
    }
  }

  deleteEmployee(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Remove the employee from the array
        this.employees = this.employees.filter(emp => emp.id !== id);

        // Save updated list to localStorage
        localStorage.setItem('employees', JSON.stringify(this.employees));

        // Update dataSource
        this.dataSource.data = [...this.employees];
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private getNextEmployeeId(): number {
    const storedEmployees = localStorage.getItem('employees');
    const employees: Employee[] = storedEmployees ? JSON.parse(storedEmployees) : [];
    return employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1;
  }

  getJobTitleById(id: number): string {
    const job = this.jobTitles.find(j => j.id === id);
    return job ? job.arabic : '';
  }
  getGenderById(id: number): string {
    const gend = this.gender.find(g => g.id === id);
    return gend ? gend.arabic : '';
  }

  getDepartmentById(id: number): string {
    const department = this.departments.find(d => d.id === id);
    return department ? department.arabic : '';
  }
}
