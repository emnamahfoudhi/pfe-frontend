import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log('Login response:', res);

        // Stocker le token
        this.authService.saveToken(res.token);

        // Debug du token
        this.authService.debugToken();

        // Récupérer le rôle pour la redirection
        const role = this.authService.getUserRole();
        console.log('User role for redirection:', role);

        // Redirection selon le rôle (sans préfixe ROLE_)
        switch (role) {
          case 'Directeur_General':
            this.router.navigate(['/dashboard-dg']);
            break;
          case 'Chef_Departement':
            this.router.navigate(['/dashboard-departement']);
            break;
          case 'Chef_Service':
            this.router.navigate(['/dashboard-service']);
            break;
          case 'EMPLOYE':
            this.router.navigate(['/dashboard-employe']);
            break;
          default:
            console.error('Role inconnu:', role);
            this.errorMessage = 'Rôle utilisateur non reconnu';
            this.router.navigate(['/unauthorized']);
            break;
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = 'Email ou mot de passe incorrect';
      }
    });
  }
}
