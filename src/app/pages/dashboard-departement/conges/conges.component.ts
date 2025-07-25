import { Component, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { NgChartsModule } from 'ng2-charts';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserDetailsDialogComponent } from './user-details-dialog-conge/user-details-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UserService } from '../../../services/user.service';
import { QuestionnaireService } from '../../../services/questionnaire.service';
import { Questionnaire, StatutQuestionnaire } from '../../../models/questionnaire.model';
import { Conge } from './conges.model';
import { CongeService } from './conges.service';


@Component({
  selector: 'app-conges',
  standalone: true,
  imports: [ MatDialogModule,
      MatToolbarModule,
      MatIconModule,
      MatGridListModule,
      MatCardModule,
      MatTableModule,
      MatButtonModule,
      NgChartsModule,
      CommonModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatTooltipModule,
      MatSelectModule,
      MatInputModule,
      MatDatepickerModule,
      MatNativeDateModule],
  templateUrl: './conges.component.html',
  styleUrl: './conges.component.css'
})
export class CongesComponent implements OnInit {
  displayedColumns: string[] = ['dateDebut', 'dateFin', 'jours_utilises', 'statut', 'dateAjout','justificatif', 'actions'];
conges: Conge[] = [];
selectedConge: Conge | null = null;
open: boolean = false;
users: any[] = [];

CongeForm!: FormGroup;

newConge: Conge = {
  id: 0,
  date_debut: '',
  date_fin: '',
  date_ajout: '',
  jours_utilises: 0,
  justificationPDF: '',
  depassement: false,
  statut: "EN_ATTENTE"
};
constructor(
    private congeService: CongeService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,

     private userService: UserService // Service pour récupérer les utilisateurs
  ) { }

  openUserDetailsDialog(user: any): void {
    const dialogRef = this.dialog.open(UserDetailsDialogComponent, {
      width: '600px',
      data: user,
      panelClass: 'custom-dialog-container'
    });
  }
  ngOnInit(): void {
  this.getAllConges();
  this.loadUsers();
  this.CongeForm = this.fb.group({
    date_debut: ['', Validators.required],
    date_fin: ['', Validators.required],
    date_ajout: ['', Validators.required],
    jours_utilises: [0, Validators.required],
    justificationPDF: [''],
    depassement: [false],
    statut: ['', Validators.required],
    userId: ['']
  });
}
onAddCongeClick(): void {
    this.open = !this.open;
    if (this.open) {
      this.selectedConge = null;
      this.CongeForm.reset();

    }
  }
  getFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
}

// Ajoutez cette méthode pour formater les dates
// Dans conges.component.ts
// Modifiez la fonction formatDate
private formatDate(date: Date | string): string {
  // Si c'est déjà une string au bon format, la retourner directement
  if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return date;
  }

  // Si c'est un objet Date, le formater
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Pour les strings mal formatées, tenter une conversion
  if (typeof date === 'string') {
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      return this.formatDate(parsed);
    }
  }

  // Fallback - utiliser la date actuelle
  return this.formatDate(new Date());
}
 getAllConges(): void {
    this.congeService.getAllConges().subscribe((data) => {
      this.conges = data;
    });
  }
 loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      users => {
        this.users = users;
      },
      error => {
        console.error('Erreur chargement utilisateurs:', error);
        this.snackBar.open('Erreur de chargement des utilisateurs', 'Fermer', {
          duration: 3000
        });
      }
    );
  }
 selectedFile: File | null = null;

onFileSelected(event: any): void {
  this.selectedFile = event.target.files[0];
}

addConge(): void {
  if (this.CongeForm.valid && this.CongeForm.get('userId')?.value) {
    const formValue = this.CongeForm.value;

    // Création du congé sans le fichier
    const newConge: Conge = {
      ...formValue,
      date_debut: this.formatDate(formValue.date_debut),
      date_fin: this.formatDate(formValue.date_fin),
      date_ajout: this.formatDate(formValue.date_ajout),
      // justificationPDF est maintenant géré côté serveur
    };

    // Appel du service avec vérification de type
    this.congeService.addCongeToUser(
      formValue.userId,
      newConge,
      this.selectedFile
    ).subscribe({
      next: (response) => {
        // Réinitialisation
        this.snackBar.open('Congé ajouté avec succès!', 'Fermer', { duration: 3000 });
        this.getAllConges();
        this.CongeForm.reset();
        this.open = false;
        this.selectedFile = null;
      },
      error: (err) => {
        this.snackBar.open(`Erreur: ${err.error?.message || 'Échec de l\'ajout'}`, 'Fermer', { duration: 3000 });
      }
    });
  }
}
updateConge(conge: Conge): void {
  if (this.CongeForm.valid) {
    const formValue = this.CongeForm.value;

    const updatedConge = {
      ...formValue,
      date_debut: this.formatDate(formValue.date_debut),
      date_fin: this.formatDate(formValue.date_fin),
      date_ajout: this.formatDate(formValue.date_ajout)
    };

    this.congeService.updateConge(conge.id, updatedConge).subscribe({
      next: () => {
        this.snackBar.open('Congé mis à jour!', 'Fermer', { duration: 3000 });
        this.getAllConges();
      },
      error: (err) => {
        this.snackBar.open(
          `Erreur: ${err.error?.message || 'Échec de la modification'}`,
          'Fermer',
          { duration: 5000 }
        );
      }
    });
  }
}



selectConge(conge: Conge): void {
  this.selectedConge = { ...conge };
  this.CongeForm.patchValue(conge);
  this.open = false;
}

deleteConge(id: number): void {
  if (confirm('Supprimer ce congé ?')) {
    this.congeService.deleteConge(id).subscribe(
      () => {
        this.snackBar.open('Congé supprimé!', 'Fermer', { duration: 3000 });
        this.getAllConges();
      }
    );
  }
}
downloadFile(id: number, fileName: string): void {
  this.congeService.downloadFile(id).subscribe(blob => {
    // Création d'une URL temporaire
    const url = window.URL.createObjectURL(blob);

    // Création d'un élément <a> invisible
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);

    // Déclenchement du téléchargement
    a.click();

    // Nettoyage
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, error => {
    this.snackBar.open('Erreur de téléchargement du fichier', 'Fermer', {
      duration: 3000
    });
  });
}

}
