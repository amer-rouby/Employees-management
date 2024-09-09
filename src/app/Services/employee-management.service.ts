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

  getAllEmployees(): Observable<Employee[]> {
    return this.db.list<Employee>(this.basePath).snapshotChanges().pipe(
      map(changes => changes.map(c => {
        const data = c.payload.val() as Employee;
        const id = c.payload.key as string;
        return { ...data, id };
      })),
      catchError(error => {
        console.error('Error fetching employees', error);
        return of([]);
      })
    );
  }

  addEmployees(data: Employee): Observable<Employee> {
    return from(this.db.list<Employee>(this.basePath).push(data).then(docRef => {
      return { ...data, id: docRef.key ?? 'default-id' }; // Add id to data
    })).pipe(
      catchError(error => {
        console.error('Error adding employee', error);
        return of({ ...data, id: 'default-id' }); // Return default object on error
      })
    );
  }

  updateEmployees(id: string, data: Employee): Observable<void> {
    return from(this.db.object<Employee>(`${this.basePath}/${id}`).update(data)).pipe(
      catchError(error => {
        console.error('Error updating employee', error);
        return of(); // Return empty observable on error
      })
    );
  }

  deleteEmployees(id: string): Observable<void> {
    return from(this.db.object(`${this.basePath}/${id}`).remove()).pipe(
      catchError(error => {
        console.error('Error deleting employee', error);
        return of(); // Return empty observable on error
      })
    );
  }
}
