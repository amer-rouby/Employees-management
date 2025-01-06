import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TypesOfVacations } from '../Models/TypesOfVacations.model';


@Injectable({
  providedIn: 'root'
})
export class TypesOfVacationsService {
    private basePath = 'Types-of-vacations';

  constructor(private db: AngularFireDatabase) { }

  // Get all Types Of Vacations requests from the database
  getAllTypesOfVacationsRequests(): Observable<TypesOfVacations[]> {
    return this.db.list<TypesOfVacations>(this.basePath).snapshotChanges().pipe(
      map(this.mapTypesOfVacationsChanges),
      catchError(this.handleError<TypesOfVacations[]>('fetching Types Of Vacations requests', []))
    );
  }

  // Add a new Types Of Vacations request to the database
  addTypesOfVacationsRequest(data: TypesOfVacations): Observable<TypesOfVacations> {
    return from(this.db.list<TypesOfVacations>(this.basePath).push(data).then(docRef => {
      return this.addIdToTypesOfVacationsData(data, docRef.key);
    })).pipe(
      catchError(this.handleError<TypesOfVacations>('adding Types Of Vacations request', { ...data, id: 'default-id' }))
    );
  }

  // Update an existing Types Of Vacations request in the database
  updateTypesOfVacationsRequest(id: string, data: TypesOfVacations): Observable<void> {
    return from(this.db.object<TypesOfVacations>(`${this.basePath}/${id}`).update(data)).pipe(
        catchError(this.handleError<void>('updating Types Of Vacations request'))
    );
  }

  // Delete a Types Of Vacations request from the database
  deleteTypesOfVacationsRequest(id: string): Observable<void> {
    return from(this.db.object(`${this.basePath}/${id}`).remove()).pipe(
        catchError(this.handleError<void>('deleting nTypes Of Vacations request'))
    );
  }

  // Helper function to map changes to Types Of Vacations data
  private mapTypesOfVacationsChanges(changes: any[]): TypesOfVacations[] {
    return changes.map(c => {
      const data = c.payload.val() as TypesOfVacations;
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

  // Helper function to add an id to Types Of Vacations data
  private addIdToTypesOfVacationsData(data: TypesOfVacations, id: string | null): TypesOfVacations {
    return { ...data, id: id ?? 'default-id' };
  }
}
