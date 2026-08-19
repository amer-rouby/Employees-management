import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gender } from '../Models/gender.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GenderService {
    private baseUrl = `${environment.apiUrl}/api/genders`;

    constructor(private http: HttpClient) { }

    getAllGenderRecords(): Observable<Gender[]> {
        return this.http.get<Gender[]>(this.baseUrl);
    }

    addGenderRecord(data: Gender): Observable<Gender> {
        return this.http.post<Gender>(this.baseUrl, data);
    }

    updateGenderRecord(id: number, data: Gender): Observable<Gender> {
        return this.http.put<Gender>(`${this.baseUrl}/${id}`, data);
    }

    deleteGenderRecord(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
