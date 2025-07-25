export interface Questionnaire {
  id?: number;
  typequestionnaire: string;
  date_creation: string;
  datesignature?: string;
  reponses: string;
  nom: string;
  prenom: string;
  validation_chef_service: boolean;
  validation_chef_departement: boolean;
  validation_sous_directeur: boolean;
  non_justifie: boolean;
  statut: StatutQuestionnaire;
  absence?: { id: number }; // Correction ici
  sanctions?: any[];
}
export enum StatutQuestionnaire {
  EN_ATTENTE_VALIDATION_CHEF_SERVICE = 'EN_ATTENTE_VALIDATION_CHEF_SERVICE',
  EN_ATTENTE_VALIDATION_CHEF_DEPARTEMENT = 'EN_ATTENTE_VALIDATION_CHEF_DEPARTEMENT',
  EN_ATTENTE_VALIDATION_SOUS_DIRECTEUR = 'EN_ATTENTE_VALIDATION_SOUS_DIRECTEUR',
  VALIDEE = 'VALIDEE',
  REJETEE = 'REJETEE'
}
