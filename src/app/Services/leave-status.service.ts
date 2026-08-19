import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { leavelStatus } from '../Models/leavelStatus.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class leavelStatusService {
  private baseUrl = `${environment.apiUrl}/api/leave-statuses`;

  constructor(private http: HttpClient) { }

  getAllleavelStatusRequests(): Observable<leavelStatus[]> {
    return this.http.get<leavelStatus[]>(this.baseUrl);
  }

  addleavelStatusRequest(data: leavelStatus): Observable<leavelStatus> {
    return this.http.post<leavelStatus>(this.baseUrl, data);
  }

  updateleavelStatusRequest(id: number, data: leavelStatus): Observable<leavelStatus> {
    return this.http.put<leavelStatus>(`${this.baseUrl}/${id}`, data);
  }

  deleteleavelStatusRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
