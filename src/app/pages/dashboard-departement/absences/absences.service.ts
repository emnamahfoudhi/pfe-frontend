import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Absence } from './absences.model';

@Injectable({
  providedIn: 'root',
})
export class AbsenceService {
  private baseUrl = 'http://localhost:8089/Absence'; // Corrigé: supprimé /api/

  constructor(private http: HttpClient) {}

  // Méthode pour obtenir les headers avec le token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  addAbsenceToUser(userId: number, absence: Absence): Observable<Absence> {
    return this.http.post<Absence>(
      `${this.baseUrl}/addAbsenceToUser/${userId}`,
      absence,
      { headers: this.getAuthHeaders() }
    );
  }

  getAllAbsences(): Observable<Absence[]> {
    return this.http.get<Absence[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getAbsenceById(id: number): Observable<Absence> {
    return this.http.get<Absence>(`${this.baseUrl}/findbyid/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateAbsence(id: number, absence: Absence): Observable<Absence> {
    return this.http.put<Absence>(`${this.baseUrl}/${id}`, absence, {
      headers: this.getAuthHeaders()
    });
  }

  addAbsence(absence: Absence): Observable<Absence> {
    return this.http.post<Absence>(this.baseUrl, absence, {
      headers: this.getAuthHeaders()
    });
  }

  deleteAbsence(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
