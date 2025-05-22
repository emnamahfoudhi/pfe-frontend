
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './../../services/auth.service';
import { StatisticsService } from '../../services/statistics.service';
import { NgChartsModule } from 'ng2-charts';
@Component({
  selector: 'app-dashboard-departement',
  standalone: true,
  imports: [
  CommonModule,
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule


  ],
  templateUrl: './dashboard-departement.component.html',
  styleUrls: ['./dashboard-departement.component.css']
})
export class DashboardDepartementComponent implements OnInit {
  userEmail: string = '';
  monthlyStats: any;
  absenceTrendData: any[] = [];
  statusDistributionData: any[] = [];

  constructor(
    private authService: AuthService,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.statisticsService.getAbsenceStatistics().subscribe({
      next: (data) => {
        this.monthlyStats = data;
        this.absenceTrendData = data.trendData;
        this.statusDistributionData = data.statusDistribution;
      },
      error: (err) => console.error('Error loading stats:', err)
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
