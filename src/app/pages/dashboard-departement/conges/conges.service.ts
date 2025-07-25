import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Conge } from "./conges.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class CongeService {
  private baseUrl = 'http://localhost:8089/CongeMaladie'; // ⚠️ ton endpoint backend pour Congé

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

// Dans CongeService
addCongeToUser(userId: number, conge: Conge, file: File | null): Observable<Conge> {
  const formData = new FormData();
  const token = localStorage.getItem('token');

  formData.append('conge', JSON.stringify({
    ...conge,
    date_debut: conge.date_debut,
    date_fin: conge.date_fin,
    date_ajout: conge.date_ajout
  }));

  if (file) {
    formData.append('file', file);
  }

  return this.http.post<Conge>(
    `${this.baseUrl}/addCongeToUser/${userId}`,
    formData,
    {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }
  );
}

  getAllConges(): Observable<Conge[]> {
    return this.http.get<Conge[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  updateConge(id: number, conge: Conge): Observable<Conge> {
    return this.http.put<Conge>(`${this.baseUrl}/${id}`, conge, {
      headers: this.getAuthHeaders()
    });
  }

  deleteConge(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
  addConge(conge: Conge): Observable<Conge> {
      return this.http.post<Conge>(this.baseUrl, conge, {
        headers: this.getAuthHeaders()
      });
    }

    downloadFile(id: number): Observable<Blob> {
  return this.http.get(`${this.baseUrl}/download/${id}`, {
    headers: this.getAuthHeaders(),
    responseType: 'blob' // Type de réponse important
  });
}
}
