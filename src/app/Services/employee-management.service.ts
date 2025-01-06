import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Employee } from '../Models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private basePath = 'employees';

  constructor(private db: AngularFireDatabase) { }

  // Fetch all employees from the database
  getAllEmployees(): Observable<Employee[]> {
    return this.db.list<Employee>(this.basePath).snapshotChanges().pipe(
      map(this.mapEmployeeChanges),
      catchError(this.handleError<Employee[]>('fetching employees', []))
    );
  }

  // Add a new employee to the database
  addEmployee(data: any): Observable<any> {
    const listRef = this.db.list<any>(this.basePath);
    return from(listRef.push(data)).pipe(
      map(ref => {
        if (ref.key) {
          const newEmployee = { ...data, id: ref.key };
          listRef.update(ref.key, newEmployee);
          return newEmployee;
        } else {
          throw new Error('Failed to retrieve the generated key');
        }
      }),
    );
  }


  // Update an existing employee in the database
  updateEmployee(id: string, data: Employee): Observable<void> {
    return from(this.db.object<Employee>(`${this.basePath}/${id}`).update(data)).pipe(
      catchError(this.handleError<void>('updating employee'))
    );
  }

  // Delete an employee from the database
  deleteEmployee(id: string): Observable<void> {
    return from(this.db.object(`${this.basePath}/${id}`).remove()).pipe(
      catchError(this.handleError<void>('deleting employee'))
    );
  }

  // Helper function to map changes to employee data
  private mapEmployeeChanges(changes: any[]): Employee[] {
    return changes.map(c => {
      const data = c.payload.val() as Employee;
      const id = c.payload.key as string;
      return { ...data, id };
    });
  }

  // Helper function to handle errors
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  // Helper function to add an id to employee data
  private addIdToEmployeeData(data: Employee, id: string | null): Employee {
    return { ...data, id: id ?? 'default-id' };
  }
}
