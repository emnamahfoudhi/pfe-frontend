import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';

@Component({
  selector: 'app-user-details-dialog',
  standalone: true, // ✅ si tu utilises standalone

  // Remplacer le template par :
template: `
<div class="custom-dialog">
  <h2 mat-dialog-title>User Details</h2>
  <mat-dialog-content>
    <div><strong>CIN:</strong> {{ data.cin || 'N/A' }}</div>
    <div><strong>NAME:</strong> {{ data.name || 'N/A' }}</div>
    <div><strong>SURNAME:</strong> {{ data.surname || 'N/A' }}</div>
    <div><strong>Birth Date:</strong> {{ data.birthDate | date }}</div>
    <div><strong>EMAIL:</strong> {{ data.email || 'N/A' }}</div>
    <div><strong>RIB:</strong> {{ data.rib || 'N/A' }}</div>
    <div><strong>Start Date:</strong> {{ data.startdate | date }}</div>
    <div><strong>End Date:</strong> {{ data.enddate | date }}</div>
  </mat-dialog-content>
  <mat-dialog-actions align="end">
    <button mat-button mat-dialog-close>Close</button>
  </mat-dialog-actions>
</div>
`,
  styleUrls: ['./user-details-dialog.component.css'],
  imports: [
    MatDialogModule, // ✅ indispensable
    MatButtonModule, // ✅ pour les <button mat-button>
    CommonModule,
  ],
})
export class UserDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UserDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
