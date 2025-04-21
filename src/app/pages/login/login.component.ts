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
        this.authService.saveToken(res.token);
  
        const role = res.roles[0]?.authority; // ex: "Directeur_General"
        
        switch (role) {
          case 'Directeur_General':
            this.router.navigate(['/dashboard-dg']);
            break;
          case 'Chef_Département':
            this.router.navigate(['/dashboard-departement']);
            break;
          case 'Chef_Service':
            this.router.navigate(['/dashboard-service']);
            break;
          case 'EMPLOYE':
            this.router.navigate(['/dashboard-employe']);
            break;
          default:
            this.router.navigate(['/unauthorized']);
            break;
        }
      },
      error: () => {
        this.errorMessage = 'Email ou mot de passe incorrect';
      }
    });
  }
  
}
