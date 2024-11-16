import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Leave } from '../Models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private basePath = 'leave-management';

  constructor(private db: AngularFireDatabase) { }

  // Get all leave requests from the database
  getAllLeaveRequests(): Observable<Leave[]> {
    return this.db.list<Leave>(this.basePath).snapshotChanges().pipe(
      map(this.mapLeaveChanges),
      catchError(this.handleError<Leave[]>('fetching leave requests', []))
    );
  }

  // Add a new leave request to the database
  addLeaveRequest(data: Leave): Observable<Leave> {
    return from(this.db.list<Leave>(this.basePath).push(data).then(docRef => {
      return this.addIdToLeaveData(data, docRef.key);
    })).pipe(
      catchError(this.handleError<Leave>('adding leave request', { ...data, id: 'default-id' }))
    );
  }

  // Update an existing leave request in the database
  updateLeaveRequest(id: string, data: Leave): Observable<void> {
    return from(this.db.object<Leave>(`${this.basePath}/${id}`).update(data)).pipe(
      catchError(this.handleError<void>('updating leave request'))
    );
  }

  // Delete a leave request from the database
  deleteLeaveRequest(id: string): Observable<void> {
    return from(this.db.object(`${this.basePath}/${id}`).remove()).pipe(
      catchError(this.handleError<void>('deleting leave request'))
    );
  }

  // Helper function to map changes to leave data
  private mapLeaveChanges(changes: any[]): Leave[] {
    return changes.map(c => {
      const data = c.payload.val() as Leave;
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

  // Helper function to add an id to leave data
  private addIdToLeaveData(data: Leave, id: string | null): Leave {
    return { ...data, id: id ?? 'default-id' };
  }
}
