import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nationalities } from '../Models/nationalities.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NationalitiesService {
  private baseUrl = `${environment.apiUrl}/api/nationalities`;

  constructor(private http: HttpClient) { }

  getAllNationalitiesRequests(): Observable<Nationalities[]> {
    return this.http.get<Nationalities[]>(this.baseUrl);
  }

  addnatioNalitiesRequest(data: Nationalities): Observable<Nationalities> {
    return this.http.post<Nationalities>(this.baseUrl, data);
  }

  updateNationalitiesRequest(id: number, data: Nationalities): Observable<Nationalities> {
    return this.http.put<Nationalities>(`${this.baseUrl}/${id}`, data);
  }

  deleteNationalitiesRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
