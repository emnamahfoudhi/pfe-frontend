import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8089';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/login`, { email, password });
  }

  getUserEmail(): string {
    const token = this.getToken();
    if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch (e) {
      console.error('Error decoding token', e);
      return '';
    }
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch (e) {
      return false;
    }
  }

  // Méthode principale pour récupérer le rôle utilisateur
  getUserRole(): string {
    const token = this.getToken();
    if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);

      // Le rôle est stocké dans le token sous 'roles'
      if (payload.roles && payload.roles.length > 0) {
        const role = payload.roles[0];
        console.log('Role from token:', role);
        return role;
      }
    } catch (e) {
      console.error('Error decoding token', e);
    }
    return '';
  }

  // Méthode pour vérifier si l'utilisateur a un rôle spécifique
  hasRole(requiredRole: string): boolean {
    const userRole = this.getUserRole();
    console.log('User role:', userRole, 'Required role:', requiredRole);

    // Vérification exacte du rôle
    return userRole === requiredRole;
  }

  // Méthode pour vérifier si l'utilisateur a un des rôles requis
  hasAnyRole(requiredRoles: string[]): boolean {
    const userRole = this.getUserRole();
    console.log('User role:', userRole, 'Required roles:', requiredRoles);

    return requiredRoles.includes(userRole);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRoles');
    this.router.navigate(['/login']);
  }

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
