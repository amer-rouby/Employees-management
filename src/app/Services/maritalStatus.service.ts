import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MaritalStatus } from '../Models/maritalStatus.model';

@Injectable({
  providedIn: 'root'
})
export class MaritalStatusService {
  private basePath = 'maritalStatus';

  constructor(private db: AngularFireDatabase) { }

  // Get all marital status records from the database
  getAllMaritalStatus(): Observable<MaritalStatus[]> {
    return this.db.list<MaritalStatus>(this.basePath).snapshotChanges().pipe(
      map(this.mapMaritalStatusChanges),
      catchError(this.handleError<MaritalStatus[]>('fetching marital status records', []))
    );
  }

  // Add a new marital status record to the database
  addMaritalStatus(data: MaritalStatus): Observable<MaritalStatus> {
    return from(this.db.list<MaritalStatus>(this.basePath).push(data).then(docRef => {
      return this.addIdToMaritalStatusData(data, docRef.key);
    })).pipe(
      catchError(this.handleError<MaritalStatus>('adding marital status record', { ...data, id: 'default-id' }))
    );
  }

  // Update an existing marital status record in the database
  updateMaritalStatus(id: string, data: MaritalStatus): Observable<void> {
    return from(this.db.object<MaritalStatus>(`${this.basePath}/${id}`).update(data)).pipe(
      catchError(this.handleError<void>('updating marital status record'))
    );
  }

  // Delete a marital status record from the database
  deleteMaritalStatus(id: string): Observable<void> {
    return from(this.db.object(`${this.basePath}/${id}`).remove()).pipe(
      catchError(this.handleError<void>('deleting marital status record'))
    );
  }

  // Helper function to map changes to marital status data
  private mapMaritalStatusChanges(changes: any[]): MaritalStatus[] {
    return changes.map(c => {
      const data = c.payload.val() as MaritalStatus;
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

  // Helper function to add an ID to marital status data
  private addIdToMaritalStatusData(data: MaritalStatus, id: string | null): MaritalStatus {
    return { ...data, id: id ?? 'default-id' };
  }
}
