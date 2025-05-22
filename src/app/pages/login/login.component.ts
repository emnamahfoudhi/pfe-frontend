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
// Dans login.component.ts
onLogin() {
  this.authService.login(this.email, this.password).subscribe({
    next: (res) => {
      // Stocker le token
      this.authService.saveToken(res.token);

      // Dans login.component.ts, après avoir sauvegardé le token
this.authService.saveToken(res.token);
this.authService.debugToken(); // <-- Ajouter cette ligne

      // Stocker les rôles séparément si nécessaire
      if (res.roles) {
        // Vérifier la structure exacte de res.roles
        console.log('Roles structure:', JSON.stringify(res.roles));

        // Si res.roles est déjà un tableau de chaînes
        if (typeof res.roles[0] === 'string') {
          localStorage.setItem('userRoles', JSON.stringify(res.roles));
        }
        // Si res.roles est un tableau d'objets avec une propriété 'authority'
        else if (res.roles[0]?.authority) {
          const roleNames = res.roles.map((r: any) => r.authority);
          localStorage.setItem('userRoles', JSON.stringify(roleNames));
        }
      }

      // Récupérer le rôle pour la redirection
      const role = this.authService.getUserRole();
      console.log('User role:', role);

      // Redirection selon le rôle
      switch (role) {
        case 'Directeur_General':
        case 'ROLE_Directeur_General':
          this.router.navigate(['/dashboard-dg']);
          break;
        case 'Chef_Departement':
        case 'ROLE_Chef_Departement':
          this.router.navigate(['/dashboard-departement']);
          break;
        case 'Chef_Service':
        case 'ROLE_Chef_Service':
          this.router.navigate(['/dashboard-service']);
          break;
        case 'EMPLOYE':
        case 'ROLE_EMPLOYE':
          this.router.navigate(['/dashboard-employe']);
          break;
        default:
          console.error('Role inconnu:', role);
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
