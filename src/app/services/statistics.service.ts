import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:8089/api/statistics';

  constructor(private http: HttpClient) {}

  getAbsenceStatistics(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
