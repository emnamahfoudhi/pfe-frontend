export interface Conge {
  id: number;
  date_debut: string;
  date_fin: string;
  date_ajout: string;
  jours_utilises: number;
  justificationPDF?: string;  // Optionnel car géré côté serveur
  fileName?: string;         // Ajouté pour le stockage frontend
  fileType?: string;         // Ajouté pour le stockage frontend
  depassement: boolean;
  statut: 'EN_ATTENTE' | 'APPROUVE' | 'REFUSE';
  user?: any;
}
