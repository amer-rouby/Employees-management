import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypesOfVacations } from '../Models/TypesOfVacations.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypesOfVacationsService {
  private baseUrl = `${environment.apiUrl}/api/types-of-vacations`;

  constructor(private http: HttpClient) { }

  getAllTypesOfVacationsRequests(): Observable<TypesOfVacations[]> {
    return this.http.get<TypesOfVacations[]>(this.baseUrl);
  }

  addTypesOfVacationsRequest(data: TypesOfVacations): Observable<TypesOfVacations> {
    return this.http.post<TypesOfVacations>(this.baseUrl, data);
  }

  updateTypesOfVacationsRequest(id: number, data: TypesOfVacations): Observable<TypesOfVacations> {
    return this.http.put<TypesOfVacations>(`${this.baseUrl}/${id}`, data);
  }

  deleteTypesOfVacationsRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
