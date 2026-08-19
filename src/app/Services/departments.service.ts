import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Departments } from '../Models/departments.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  private baseUrl = `${environment.apiUrl}/api/departments`;

  constructor(private http: HttpClient) { }

  getAllDepartmentsRequests(): Observable<Departments[]> {
    return this.http.get<Departments[]>(this.baseUrl);
  }

  addDepartmentsRequest(data: Departments): Observable<Departments> {
    return this.http.post<Departments>(this.baseUrl, data);
  }

  updateDepartmentsRequest(id: number, data: Departments): Observable<Departments> {
    return this.http.put<Departments>(`${this.baseUrl}/${id}`, data);
  }

  deleteDepartmentsRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
