import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Departments } from '../Models/departments.model';


@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  private basePath = 'departments';

  constructor(private db: AngularFireDatabase) { }

  // Get all departments requests from the database
  getAllDepartmentsRequests(): Observable<Departments[]> {
    return this.db.list<Departments>(this.basePath).snapshotChanges().pipe(
      map(this.mapDepartmentsChanges),
      catchError(this.handleError<Departments[]>('fetching departments requests', []))
    );
  }

  // Add a new departments request to the database
  addDepartmentsRequest(data: Departments): Observable<Departments> {
    return from(this.db.list<Departments>(this.basePath).push(data).then(docRef => {
      return this.addIdToDepartmentsData(data, docRef.key);
    })).pipe(
      catchError(this.handleError<Departments>('adding departments request', { ...data, id: 'default-id' }))
    );
  }

  // Update an existing departments request in the database
  updateDepartmentsRequest(id: string, data: Departments): Observable<void> {
    return from(this.db.object<Departments>(`${this.basePath}/${id}`).update(data)).pipe(
      catchError(this.handleError<void>('updating Departments request'))
    );
  }

  // Delete a Departments request from the database
  deleteDepartmentsRequest(id: string): Observable<void> {
    return from(this.db.object(`${this.basePath}/${id}`).remove()).pipe(
      catchError(this.handleError<void>('deleting Departments request'))
    );
  }

  // Helper function to map changes to Departments data
  private mapDepartmentsChanges(changes: any[]): Departments[] {
    return changes.map(c => {
      const data = c.payload.val() as Departments;
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

  // Helper function to add an id to Departments data
  private addIdToDepartmentsData(data: Departments, id: string | null): Departments {
    return { ...data, id: id ?? 'default-id' };
  }
}
