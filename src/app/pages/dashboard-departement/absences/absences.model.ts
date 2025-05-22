export interface Absence {
  id: number;
  dataeabsence: string;     // Format ISO (YYYY-MM-DD)
  raison_absence: string;
  dateAjout: string;
  statut: 'EN_ATTENTE' | 'JUSTIFIEE' | 'NON_JUSTIFIEE'; 
}
