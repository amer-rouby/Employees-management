import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee } from '../Models/employee.model';
import { environment } from '../../environments/environment';

interface EmployeePage {
  content: any[];
}

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private baseUrl = `${environment.apiUrl}/api/employees`;

  constructor(private http: HttpClient) { }

  // Fetch all employees from the database
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<EmployeePage>(`${this.baseUrl}?size=1000`).pipe(
      map(page => page.content.map(this.fromBackendEmployee))
    );
  }

  // Add a new employee to the database
  addEmployee(data: any): Observable<Employee> {
    return this.http.post<any>(this.baseUrl, this.toEmployeeRequest(data)).pipe(
      map(this.fromBackendEmployee)
    );
  }

  // Update an existing employee in the database
  updateEmployee(id: number, data: Employee): Observable<Employee> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, this.toEmployeeRequest(data)).pipe(
      map(this.fromBackendEmployee)
    );
  }

  // Delete an employee from the database
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Map the frontend form/model shape to the backend's EmployeeRequest shape
  private toEmployeeRequest(data: any): any {
    return {
      arabic: data.name,
      english: data.englishName,
      departmentId: data.departmentId,
      jobTitleId: data.jobTitleId,
      genderId: data.genderId,
      nationalityId: data.nationalitieId,
      maritalStatusId: data.maritalStatusId,
      phoneNumber: data.phoneNumber,
      identityNumber: data.identityNumber,
      hireDate: data.hireDate,
    };
  }

  // Map the backend Employee response shape to the frontend Employee model.
  // Defined as an arrow function field so `this` stays bound when passed as a bare
  // reference to rxjs `map()` / `Array.prototype.map()`.
  private fromBackendEmployee = (raw: any): Employee => {
    return {
      id: raw.id,
      name: raw.arabic,
      englishName: raw.english,
      departmentId: raw.department?.id,
      jobTitleId: raw.jobTitle?.id,
      genderId: raw.gender?.id,
      nationalitieId: raw.nationality?.id,
      maritalStatusId: raw.maritalStatus?.id,
      phoneNumber: raw.phoneNumber,
      identityNumber: raw.identityNumber,
      hireDate: raw.hireDate ? this.parseLocalDate(raw.hireDate) : raw.hireDate,
    };
  };

  // Parse a yyyy-MM-dd date-only string as a local date, avoiding the UTC-midnight
  // interpretation `new Date(string)` uses (which can shift the day in some timezones).
  private parseLocalDate(dateOnly: string): Date {
    const [year, month, day] = dateOnly.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
}
