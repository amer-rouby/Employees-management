import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Nationalities } from '../Models/nationalities.model';

@Injectable({
  providedIn: 'root'
})
export class NationalitiesService {
  private basePath = 'nationalities';

  constructor(private db: AngularFireDatabase) { }

  // Get all nationalities requests from the database
  getAllNationalitiesRequests(): Observable<Nationalities[]> {
    return this.db.list<Nationalities>(this.basePath).snapshotChanges().pipe(
      map(this.mapnatioNalitiesChanges),
      catchError(this.handleError<Nationalities[]>('fetching nationalities requests', []))
    );
  }

  // Add a new nationalities request to the database
  addnatioNalitiesRequest(data: Nationalities): Observable<Nationalities> {
    return from(this.db.list<Nationalities>(this.basePath).push(data).then(docRef => {
      return this.addIdTonatioNalitiesData(data, docRef.key);
    })).pipe(
      catchError(this.handleError<Nationalities>('adding nationalities request', { ...data, id: 'default-id' }))
    );
  }

  // Update an existing nationalities request in the database
  updateNationalitiesRequest(id: string, data: Nationalities): Observable<void> {
    return from(this.db.object<Nationalities>(`${this.basePath}/${id}`).update(data)).pipe(
      catchError(this.handleError<void>('updating nationalities request'))
    );
  }

  // Delete a nationalities request from the database
  deleteNationalitiesRequest(id: string): Observable<void> {
    return from(this.db.object(`${this.basePath}/${id}`).remove()).pipe(
      catchError(this.handleError<void>('deleting nationalities request'))
    );
  }

  // Helper function to map changes to nationalities data
  private mapnatioNalitiesChanges(changes: any[]): Nationalities[] {
    return changes.map(c => {
      const data = c.payload.val() as Nationalities;
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

  // Helper function to add an id to nationalities data
  private addIdTonatioNalitiesData(data: Nationalities, id: string | null): Nationalities {
    return { ...data, id: id ?? 'default-id' };
  }
}
