import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaritalStatus } from '../Models/maritalStatus.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaritalStatusService {
  private baseUrl = `${environment.apiUrl}/api/marital-statuses`;

  constructor(private http: HttpClient) { }

  getAllMaritalStatus(): Observable<MaritalStatus[]> {
    return this.http.get<MaritalStatus[]>(this.baseUrl);
  }

  addMaritalStatus(data: MaritalStatus): Observable<MaritalStatus> {
    return this.http.post<MaritalStatus>(this.baseUrl, data);
  }

  updateMaritalStatus(id: number, data: MaritalStatus): Observable<MaritalStatus> {
    return this.http.put<MaritalStatus>(`${this.baseUrl}/${id}`, data);
  }

  deleteMaritalStatus(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
