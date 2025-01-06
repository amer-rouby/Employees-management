import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { leavelStatus } from '../Models/leavelStatus.model';



@Injectable({
  providedIn: 'root'
})
export class leavelStatusService {
    private basePath = 'leavel-Status';

  constructor(private db: AngularFireDatabase) { }

  // Get all leavel Status requests from the database
  getAllleavelStatusRequests(): Observable<leavelStatus[]> {
    return this.db.list<leavelStatus>(this.basePath).snapshotChanges().pipe(
      map(this.mapleavelStatusChanges),
      catchError(this.handleError<leavelStatus[]>('fetching leavel Status requests', []))
    );
  }

  // Add a new leavel Status request to the database
  addleavelStatusRequest(data: leavelStatus): Observable<leavelStatus> {
    return from(this.db.list<leavelStatus>(this.basePath).push(data).then(docRef => {
      return this.addIdToleavelStatusData(data, docRef.key);
    })).pipe(
      catchError(this.handleError<leavelStatus>('adding leavel Status request', { ...data, id: 'default-id' }))
    );
  }

  // Update an existing leavel Status request in the database
  updateleavelStatusRequest(id: string, data: leavelStatus): Observable<void> {
    return from(this.db.object<leavelStatus>(`${this.basePath}/${id}`).update(data)).pipe(
        catchError(this.handleError<void>('updating leavel Status request'))
    );
  }

  // Delete a leavel Status request from the database
  deleteleavelStatusRequest(id: string): Observable<void> {
    return from(this.db.object(`${this.basePath}/${id}`).remove()).pipe(
        catchError(this.handleError<void>('deleting nleavel Status request'))
    );
  }

  // Helper function to map changes to leavel Status data
  private mapleavelStatusChanges(changes: any[]): leavelStatus[] {
    return changes.map(c => {
      const data = c.payload.val() as leavelStatus;
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

  // Helper function to add an id to leavel Status data
  private addIdToleavelStatusData(data: leavelStatus, id: string | null): leavelStatus {
    return { ...data, id: id ?? 'default-id' };
  }
}
