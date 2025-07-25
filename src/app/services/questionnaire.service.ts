import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Questionnaire } from '../models/questionnaire.model';


@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  private apiUrl = 'http://localhost:8089/Questionnaire'; // Adaptez à votre URL

  constructor(private http: HttpClient) { }

  addQuestionnaire(questionnaire: Questionnaire): Observable<Questionnaire> {
    return this.http.post<Questionnaire>(`${this.apiUrl}/save`, questionnaire);
  }
}
