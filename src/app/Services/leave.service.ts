import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Leave } from '../Models/leave.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private baseUrl = `${environment.apiUrl}/api/leaves`;

  constructor(private http: HttpClient) { }

  // Get all leave requests from the database
  getAllLeaveRequests(): Observable<Leave[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(records => records.map(this.fromBackendLeave))
    );
  }

  // Add a new leave request to the database
  addLeaveRequest(data: Leave): Observable<Leave> {
    return this.http.post<any>(this.baseUrl, this.toLeaveRequest(data)).pipe(
      map(this.fromBackendLeave)
    );
  }

  // Update an existing leave request in the database
  updateLeaveRequest(id: number, data: Leave): Observable<Leave> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, this.toLeaveRequest(data)).pipe(
      map(this.fromBackendLeave)
    );
  }

  // Delete a leave request from the database
  deleteLeaveRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  private toLeaveRequest(data: any): any {
    return {
      arabic: data.name,
      english: data.englishName,
      types: data.types,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
    };
  }

  private fromBackendLeave = (raw: any): Leave => {
    return {
      id: raw.id,
      name: raw.arabic,
      englishName: raw.english,
      types: raw.types,
      status: raw.status,
      startDate: raw.startDate,
      endDate: raw.endDate,
    };
  };
}
