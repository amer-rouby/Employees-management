import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobTitles } from '../Models/JobTitles.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobTitlesService {
  private baseUrl = `${environment.apiUrl}/api/job-titles`;

  constructor(private http: HttpClient) { }

  getAllJobTitlesRequests(): Observable<JobTitles[]> {
    return this.http.get<JobTitles[]>(this.baseUrl);
  }

  addJobTitlesRequest(data: JobTitles): Observable<JobTitles> {
    return this.http.post<JobTitles>(this.baseUrl, data);
  }

  updateJobTitlesRequest(id: number, data: JobTitles): Observable<JobTitles> {
    return this.http.put<JobTitles>(`${this.baseUrl}/${id}`, data);
  }

  deleteJobTitlesRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
