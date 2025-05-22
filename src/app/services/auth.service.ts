import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8089';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/login`, { email, password });
  }
   getUserEmail(): string {
    const token = this.getToken();
    if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub; // Adaptez selon la structure de votre JWT
    } catch (e) {
      console.error('Error decoding token', e);
      return '';
    }
  }

  // Dans auth.service.ts
saveToken(token: string, roles?: any[]): void {
  localStorage.setItem('token', token);
  if (roles) {
    localStorage.setItem('userRoles', JSON.stringify(roles));
  }
}
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
  }

 // Dans auth.service.ts
getUserRole(): string {
  // D'abord essayer de récupérer depuis localStorage
  const rolesStr = localStorage.getItem('userRoles');
  if (rolesStr) {
    try {
      const roles = JSON.parse(rolesStr);
      return roles[0] || '';
    } catch (e) {
      console.error('Error parsing roles from localStorage', e);
    }
  }

  // Fallback: extraire du token JWT si disponible
  const token = this.getToken();
  if (!token) return '';

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const rawRoles = payload.roles || [];

    // Si c'est déjà un tableau, prendre le premier élément
    if (Array.isArray(rawRoles)) {
      const role = rawRoles[0] || '';
      // Supprimer le préfixe "ROLE_" si présent
      return role.replace(/^ROLE_/, '');
    }

    return '';
  } catch (e) {
    console.error('Error decoding token', e);
    return '';
  }
}

// Dans auth.service.ts
debugToken(): void {
  const token = this.getToken();
  if (!token) {
    console.log('No token found');
    return;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid token format');
      return;
    }

    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));

    console.log('Token header:', header);
    console.log('Token payload:', payload);
    console.log('Token expiry:', new Date(payload.exp * 1000).toLocaleString());
    console.log('Roles in token:', payload.roles);
  } catch (e) {
    console.error('Error decoding token', e);
  }
}




}
