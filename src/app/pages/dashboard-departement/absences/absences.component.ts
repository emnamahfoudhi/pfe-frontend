import { Component, OnInit } from '@angular/core';
import { AbsenceService } from './absences.service';
import { Absence } from './absences.model';
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
import { UserDetailsDialogComponent } from './user-details-dialog/user-details-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UserService } from '../../../services/user.service';
import { QuestionnaireService } from '../../../services/questionnaire.service';
import { Questionnaire, StatutQuestionnaire } from '../../../models/questionnaire.model';

@Component({
  selector: 'app-absence',
  templateUrl: './absences.component.html',
  styleUrls: ['./absences.component.css'],
  standalone: true,
  imports: [
    MatDialogModule,
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
    MatNativeDateModule
  ]
})
export class AbsenceComponent implements OnInit {
  displayedColumns: string[] = ['dateAbsence', 'raison', 'statut', 'dateAjout', 'actions'];
  selectedUser: any = {};
   users: any[] = []; // Liste des utilisateurs

  AbsenceForm!: FormGroup;
  absences: Absence[] = [];
  selectedabsence: Absence | null = null;
  open: boolean = false;
  newabsence: Absence = {
    id: 0,
    dataeabsence: '',
    raison_absence: '',
    statut: "EN_ATTENTE",
    dateAjout: ''
  };

  constructor(
    private absenceService: AbsenceService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private questionnaireService: QuestionnaireService,
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
    this.getAllabsences();
    this.loadUsers(); // Charge les utilisateurs ici
    this.AbsenceForm = this.fb.group({
      dataeabsence: ['', Validators.required],
      raison_absence: ['', [Validators.required]],
      statut: ['EN_ATTENTE', Validators.required], // Valeur par défaut définie ici
      dateAjout: ['', [Validators.required]],
      userId: ['']
    });
  }

  onAddAbsenceClick(): void {
    this.open = !this.open;
    if (this.open) {
      this.selectedabsence = null;
      this.AbsenceForm.reset();
      // Réinitialiser le statut à "EN_ATTENTE" lors de l'ouverture du formulaire d'ajout
      this.AbsenceForm.patchValue({ statut: 'EN_ATTENTE' });
    }
  }
  // Ajoutez cette méthode pour formater les dates
private formatDate(date: Date): string {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

  getAllabsences(): void {
    this.absenceService.getAllAbsences().subscribe((data) => {
      this.absences = data;
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

  addAbsence(): void {
    if (this.AbsenceForm.valid && this.AbsenceForm.get('userId')?.value) {
      const formValue = this.AbsenceForm.value;
      const userId = this.AbsenceForm.get('userId')?.value;

      // Formater les dates avant envoi
      const newabsence = {
        ...formValue,
        dataeabsence: this.formatDate(formValue.dataeabsence),
        dateAjout: this.formatDate(formValue.dateAjout)
      };

      this.absenceService.addAbsenceToUser(userId, newabsence).subscribe(
        (response) => {
          console.log('Absence ajoutée:', response);
          this.createQuestionnaireForUser(userId, response.id);

          this.AbsenceForm.reset();
          this.open = false;
          this.getAllabsences();

          this.snackBar.open('Absence ajoutée avec succès!', 'Fermer', {
            duration: 3000
          });
        },
        (error) => {
          console.error('Erreur:', error);
          this.snackBar.open('Erreur lors de l\'ajout', 'Fermer', {
            duration: 3000
          });
        }
      );
    } else {
      this.snackBar.open('Veuillez remplir tous les champs et sélectionner un utilisateur', 'Fermer', {
        duration: 3000
      });
    }
  }

  private createQuestionnaireForUser(userId: number, absenceId: number): void {
    this.userService.getUserById(userId).subscribe(
      (user) => {
        const newQuestionnaire: Questionnaire = {
          typequestionnaire: 'Absence',
          date_creation: new Date().toISOString().split('T')[0],
          reponses: '',
          nom: user.nom,
          prenom: user.prenom,
          validation_chef_service: false,
          validation_chef_departement: false,
          validation_sous_directeur: false,
          non_justifie: false,
          statut: StatutQuestionnaire.EN_ATTENTE_VALIDATION_CHEF_SERVICE,
          absence: { id: absenceId }
        };

        this.questionnaireService.addQuestionnaire(newQuestionnaire).subscribe(
          (response) => {
            console.log('Questionnaire créé:', response);
            this.snackBar.open('Questionnaire créé avec succès!', 'Fermer', {
              duration: 2000
            });
          },
          (error) => {
            console.error('Erreur création questionnaire:', error);
          }
        );
      },
      (error) => {
        console.error('Erreur récupération utilisateur:', error);
      }
    );
  }

updateAbsence(absence: Absence): void {
  if (this.AbsenceForm.valid) {
    const formValue = this.AbsenceForm.value;

    // Formater les dates avant envoi
    const updatedAbsence = {
      ...formValue,
      dataeabsence: this.formatDate(formValue.dataeabsence),
      dateAjout: this.formatDate(formValue.dateAjout)
    };

    this.absenceService.updateAbsence(absence.id, updatedAbsence).subscribe(
      (response) => {
        console.log('Absence mise à jour:', response);
        this.selectedabsence = null;
        this.getAllabsences();
        this.snackBar.open('Absence modifiée avec succès!', 'Fermer', {
          duration: 3000
        });
      },
      (error) => {
        console.error('Erreur:', error);  
        this.snackBar.open('Erreur lors de la modification', 'Fermer', {
          duration: 3000
        });
      }
    );
  }
}
  selectAbsence(absence: Absence): void {
    this.selectedabsence = { ...absence };
    this.AbsenceForm.patchValue(absence);
    this.open = false; // Fermer le formulaire d'ajout si ouvert
  }

  deleteAbsence(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette absence?')) {
      this.absenceService.deleteAbsence(id).subscribe(
        () => {
          this.absences = this.absences.filter(absence => absence.id !== id);
          this.snackBar.open('Absence supprimée avec succès!', 'Fermer', {
            duration: 3000
          });
        },
        (error) => {
          console.error('Erreur:', error);
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', {
            duration: 3000
          });
        }
      );
    }
  }
}
