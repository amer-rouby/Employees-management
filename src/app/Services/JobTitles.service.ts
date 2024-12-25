import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JobTitles } from '../Models/JobTitles.model';


@Injectable({
  providedIn: 'root'
})
export class JobTitlesService {
  private basePath = 'job-titles';

  constructor(private db: AngularFireDatabase) { }

  // Get all JobTitles requests from the database
  getAllJobTitlesRequests(): Observable<JobTitles[]> {
    return this.db.list<JobTitles>(this.basePath).snapshotChanges().pipe(
      map(this.mapJobTitlesChanges),
      catchError(this.handleError<JobTitles[]>('fetching JobTitles requests', []))
    );
  }

  // Add a new JobTitles request to the database
  addJobTitlesRequest(data: JobTitles): Observable<JobTitles> {
    return from(this.db.list<JobTitles>(this.basePath).push(data).then(docRef => {
      return this.addIdToJobTitlesData(data, docRef.key);
    })).pipe(
      catchError(this.handleError<JobTitles>('adding JobTitles request', { ...data, id: 'default-id' }))
    );
  }

  // Update an existing JobTitles request in the database
  updateJobTitlesRequest(id: string, data: JobTitles): Observable<void> {
    return from(this.db.object<JobTitles>(`${this.basePath}/${id}`).update(data)).pipe(
      catchError(this.handleError<void>('updating JobTitles request'))
    );
  }

  // Delete a JobTitles request from the database
  deleteJobTitlesRequest(id: string): Observable<void> {
    return from(this.db.object(`${this.basePath}/${id}`).remove()).pipe(
      catchError(this.handleError<void>('deleting JobTitles request'))
    );
  }

  // Helper function to map changes to JobTitles data
  private mapJobTitlesChanges(changes: any[]): JobTitles[] {
    return changes.map(c => {
      const data = c.payload.val() as JobTitles;
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

  // Helper function to add an id to JobTitles data
  private addIdToJobTitlesData(data: JobTitles, id: string | null): JobTitles {
    return { ...data, id: id ?? 'default-id' };
  }
}
