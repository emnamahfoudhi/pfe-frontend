import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Absence } from './absences.model';


@Injectable({
  providedIn: 'root'
})
export class AbsenceService {
  private baseUrl = 'http://localhost:8089/Absence';


  constructor(private http: HttpClient) {}


  getAllAbsences(): Observable<Absence[]> {
    return this.http.get<Absence[]>(`${this.baseUrl}/all`);
   }


  getAbsenceById(id: number): Observable<Absence> {
    return this.http.get<Absence>(`${this.baseUrl}/findbyid/${id}`);
  }


  updateAbsence(absence: Absence): Observable<Absence> {
    return this.http.put<Absence>(`${this.baseUrl}/updateabsence`, absence);
  }


  deleteAbsence(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteabsence/${id}`, { responseType: 'text' });
  }
}
