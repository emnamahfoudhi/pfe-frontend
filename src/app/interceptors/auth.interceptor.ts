import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Récupérer le token
    const token = this.authService.getToken();

    // Si le token existe et ce n'est pas une requête de login
    if (token && !req.url.includes('/api/auth/login')) {
      // Cloner la requête et ajouter le header Authorization
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });

      return next.handle(authReq);
    }

    // Sinon, passer la requête sans modification
    return next.handle(req);
  }
}
