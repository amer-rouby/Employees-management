import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Gender } from '../Models/gender.model';

@Injectable({
    providedIn: 'root'
})
export class GenderService {
    private basePath = 'gender';

    constructor(private db: AngularFireDatabase) { }

    // Get all gender records from the database
    getAllGenderRecords(): Observable<Gender[]> {
        return this.db.list<Gender>(this.basePath).snapshotChanges().pipe(
            map(this.mapGenderChanges),
            catchError(this.handleError<Gender[]>('fetching gender records', []))
        );
    }

    // Add a new gender record to the database
    addGenderRecord(data: Gender): Observable<Gender> {
        return from(this.db.list<Gender>(this.basePath).push(data).then(docRef => {
            return this.addIdToGenderData(data, docRef.key);
        })).pipe(
            catchError(this.handleError<Gender>('adding gender record', { ...data, id: 'default-id' }))
        );
    }

    // Update an existing gender record in the database
    updateGenderRecord(id: string, data: Gender): Observable<void> {
        return from(this.db.object<Gender>(`${this.basePath}/${id}`).update(data)).pipe(
            catchError(this.handleError<void>('updating gender record'))
        );
    }

    // Delete a gender record from the database
    deleteGenderRecord(id: string): Observable<void> {
        return from(this.db.object(`${this.basePath}/${id}`).remove()).pipe(
            catchError(this.handleError<void>('deleting gender record'))
        );
    }

    // Helper function to map changes to gender data
    private mapGenderChanges(changes: any[]): Gender[] {
        return changes.map(c => {
            const data = c.payload.val() as Gender;
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

    // Helper function to add an ID to gender data
    private addIdToGenderData(data: Gender, id: string | null): Gender {
        return { ...data, id: id ?? 'default-id' };
    }
}
