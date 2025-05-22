import { Component, OnInit } from '@angular/core';
import {  ChartType } from 'chart.js';

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
import { ChartData, ChartOptions } from 'chart.js';






@Component({
  selector: 'app-absence',
  templateUrl: './absences.component.html',
  styleUrls: ['./absences.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
     NgChartsModule
  ]
})
export class AbsenceComponent implements OnInit {
  displayedColumns: string[] = ['id', 'dataeabsence', 'raison_absence', 'statut', 'actions'];
  absences: Absence[] = [];

  // Chart Data
  chartLabels: string[] = [];
  chartData: ChartData<'bar', number[], string> = {
  labels: [],
  datasets: [
    {
      data: [],
      label: 'Nombre d\'absences'
    }
  ]
};

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
    }
  };

  constructor(private absenceService: AbsenceService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadAbsences();
  }

  loadAbsences(): void {
    this.absenceService.getAllAbsences().subscribe({
      next: (data) => {
        this.absences = data;
        this.prepareChartData();
      },
      error: (err) => console.error("Erreur :", err)
    });
  }

  prepareChartData(): void {
  const grouped = this.absences.reduce((acc, absence) => {
    const month = new Date(absence.dataeabsence).toLocaleString('fr-FR', { month: 'long' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const labels = Object.keys(grouped);
  const data = labels.map(label => grouped[label]);

  this.chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        label: 'Nombre d\'absences'
      }
    ]
  };
}

  ajouterAbsence(): void {
    this.snackBar.open('Formulaire d’ajout à implémenter', 'OK', { duration: 2000 });
  }

  modifierAbsence(absence: Absence): void {
    this.absenceService.updateAbsence(absence).subscribe({
      next: () => {
        this.snackBar.open('Absence modifiée', 'OK', { duration: 2000 });
        this.loadAbsences();
      },
      error: () => this.snackBar.open('Erreur modification', 'OK', { duration: 2000 })
    });
  }

  supprimerAbsence(id: number): void {
    if (confirm('Supprimer cette absence ?')) {
      this.absenceService.deleteAbsence(id).subscribe({
        next: () => {
          this.snackBar.open('Absence supprimée', 'OK', { duration: 2000 });
          this.loadAbsences();
        },
        error: () => this.snackBar.open('Erreur suppression', 'OK', { duration: 2000 })
      });
    }
  }
}
