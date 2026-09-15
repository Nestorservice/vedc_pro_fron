export interface Personne {
  id: string;
  nom: string;
  prenom: string;
  sexe: 'M' | 'F';
  date_naissance: string;
  telephone1?: string;
  situation_matrimoniale?: string;
  statut: 'actif' | 'inactif' | 'transfere';
  territoire_id: string;
  territoire_nom: string;
  date_adhesion: string;
  created_at: string;
}

export interface Territoire {
  id: string;
  nom: string;
  niveau: 'pays' | 'region' | 'departement' | 'district' | 'eglise_locale' | 'circonscription';
  code: string;
  parent_id?: string;
  actif: boolean;
  created_at: string;
}

export interface Serviteur {
  id: string;
  personne_id: string;
  personne_nom: string;
  grade: string;
  territoire_id: string;
  territoire_nom: string;
  date_promotion: string;
  statut: 'actif' | 'inactif';
  created_at: string;
}

export interface Transfert {
  id: string;
  personne_id: string;
  personne_nom: string;
  territoire_origine: string;
  territoire_destination: string;
  statut: 'en_attente' | 'valide' | 'rejete' | 'annule';
  date_demande: string;
  date_validation?: string;
  motif: string;
}

export interface Utilisateur {
  id: string;
  email: string;
  nom_complet: string;
  role: 'super_admin' | 'admin_national' | 'admin_regional' | 'admin_local' | 'lecteur';
  territoire_id: string;
  actif: boolean;
  derniere_connexion: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  action: string;
  utilisateur: string;
  ressource: string;
  details: string;
  timestamp: string;
  ip_address: string;
}

export interface DashboardData {
  total_membres: number;
  total_serviteurs: number;
  total_territoires: number;
  transferts_en_attente: number;
  nouveaux_membres_mois: number;
  croissance_annuelle: number;
  repartition_sexe: { nom: string; valeur: number }[];
  effectifs_par_territoire: { territoire: string; effectif: number }[];
  mouvements_mensuels: { mois: string; entrees: number; sorties: number }[];
  activites_recentes: { action: string; utilisateur: string; timestamp: string }[];
}

export const mockDashboard: DashboardData = {
  total_membres: 12847,
  total_serviteurs: 1456,
  total_territoires: 234,
  transferts_en_attente: 23,
  nouveaux_membres_mois: 187,
  croissance_annuelle: 12.4,
  repartition_sexe: [
    { nom: 'Hommes', valeur: 6234 },
    { nom: 'Femmes', valeur: 6613 },
  ],
  effectifs_par_territoire: [
    { territoire: 'Douala I', effectif: 2340 },
    { territoire: 'Yaounde Centre', effectif: 1890 },
    { territoire: 'Bamenda', effectif: 1567 },
    { territoire: 'Bafoussam', effectif: 1234 },
    { territoire: 'Garoua', effectif: 987 },
    { territoire: 'Maroua', effectif: 876 },
  ],
  mouvements_mensuels: [
    { mois: 'Jan', entrees: 45, sorties: 12 },
    { mois: 'Fev', entrees: 52, sorties: 8 },
    { mois: 'Mar', entrees: 38, sorties: 15 },
    { mois: 'Avr', entrees: 61, sorties: 10 },
    { mois: 'Mai', entrees: 49, sorties: 7 },
    { mois: 'Jun', entrees: 55, sorties: 11 },
  ],
  activites_recentes: [
    { action: 'Nouveau membre inscrit', utilisateur: 'Pasteur Nkomo', timestamp: '2024-01-15T14:30:00Z' },
    { action: 'Transfert valide', utilisateur: 'Admin Regional Douala', timestamp: '2024-01-15T13:15:00Z' },
    { action: 'Serviteur promu', utilisateur: 'Super Admin', timestamp: '2024-01-15T11:45:00Z' },
    { action: 'Territoire cree', utilisateur: 'Admin National', timestamp: '2024-01-15T10:20:00Z' },
    { action: 'Fiche membre modifiee', utilisateur: 'Secretaire Local', timestamp: '2024-01-15T09:00:00Z' },
  ],
};

export const mockPersonnes: Personne[] = [
  { id: '1', nom: 'Mbarga', prenom: 'Jean-Pierre', sexe: 'M', date_naissance: '1985-03-10', telephone1: '+237 6XX XXX XXX', situation_matrimoniale: 'marie', statut: 'actif', territoire_id: 't1', territoire_nom: 'Douala I', date_adhesion: '2010-06-15', created_at: '2010-06-15T00:00:00Z' },
  { id: '2', nom: 'Ngono', prenom: 'Marie-Claire', sexe: 'F', date_naissance: '1992-07-22', telephone1: '+237 6XX XXX XXX', situation_matrimoniale: 'celibataire', statut: 'actif', territoire_id: 't1', territoire_nom: 'Douala I', date_adhesion: '2015-09-01', created_at: '2015-09-01T00:00:00Z' },
  { id: '3', nom: 'Essomba', prenom: 'Paul', sexe: 'M', date_naissance: '1978-11-05', telephone1: '+237 6XX XXX XXX', situation_matrimoniale: 'marie', statut: 'actif', territoire_id: 't2', territoire_nom: 'Yaounde Centre', date_adhesion: '2005-03-20', created_at: '2005-03-20T00:00:00Z' },
  { id: '4', nom: 'Atangana', prenom: 'Grace', sexe: 'F', date_naissance: '1990-01-18', telephone1: '+237 6XX XXX XXX', situation_matrimoniale: 'marie', statut: 'actif', territoire_id: 't2', territoire_nom: 'Yaounde Centre', date_adhesion: '2012-11-10', created_at: '2012-11-10T00:00:00Z' },
  { id: '5', nom: 'Nkoulou', prenom: 'Samuel', sexe: 'M', date_naissance: '1988-05-30', telephone1: '+237 6XX XXX XXX', situation_matrimoniale: 'celibataire', statut: 'transfere', territoire_id: 't3', territoire_nom: 'Bamenda', date_adhesion: '2008-07-14', created_at: '2008-07-14T00:00:00Z' },
  { id: '6', nom: 'Biyik', prenom: 'Esther', sexe: 'F', date_naissance: '1995-09-12', telephone1: '+237 6XX XXX XXX', situation_matrimoniale: 'celibataire', statut: 'actif', territoire_id: 't3', territoire_nom: 'Bamenda', date_adhesion: '2018-01-05', created_at: '2018-01-05T00:00:00Z' },
  { id: '7', nom: 'Fotso', prenom: 'Daniel', sexe: 'M', date_naissance: '1982-12-25', telephone1: '+237 6XX XXX XXX', situation_matrimoniale: 'marie', statut: 'actif', territoire_id: 't4', territoire_nom: 'Bafoussam', date_adhesion: '2003-04-18', created_at: '2003-04-18T00:00:00Z' },
  { id: '8', nom: 'Kamga', prenom: 'Ruth', sexe: 'F', date_naissance: '1998-04-08', telephone1: '+237 6XX XXX XXX', situation_matrimoniale: 'celibataire', statut: 'actif', territoire_id: 't4', territoire_nom: 'Bafoussam', date_adhesion: '2020-08-22', created_at: '2020-08-22T00:00:00Z' },
  { id: '9', nom: 'Tchinda', prenom: 'Emmanuel', sexe: 'M', date_naissance: '1975-06-14', telephone1: '+237 6XX XXX XXX', situation_matrimoniale: 'marie', statut: 'actif', territoire_id: 't5', territoire_nom: 'Garoua', date_adhesion: '2000-01-30', created_at: '2000-01-30T00:00:00Z' },
  { id: '10', nom: 'Ndama', prenom: 'Deborah', sexe: 'F', date_naissance: '1993-08-20', telephone1: '+237 6XX XXX XXX', situation_matrimoniale: 'marie', statut: 'inactif', territoire_id: 't5', territoire_nom: 'Garoua', date_adhesion: '2016-05-12', created_at: '2016-05-12T00:00:00Z' },
  { id: '11', nom: 'Owona', prenom: 'Pierre', sexe: 'M', date_naissance: '1987-02-14', telephone1: '+237 6XX XXX XXX', situation_matrimoniale: 'marie', statut: 'actif', territoire_id: 't1', territoire_nom: 'Douala I', date_adhesion: '2011-03-08', created_at: '2011-03-08T00:00:00Z' },
  { id: '12', nom: 'Mballa', prenom: 'Sarah', sexe: 'F', date_naissance: '1991-10-03', telephone1: '+237 6XX XXX XXX', situation_matrimoniale: 'celibataire', statut: 'actif', territoire_id: 't2', territoire_nom: 'Yaounde Centre', date_adhesion: '2017-12-01', created_at: '2017-12-01T00:00:00Z' },
];

export const mockTerritoires: Territoire[] = [
  { id: 't0', nom: 'Cameroun', niveau: 'pays', code: 'CMR', actif: true, created_at: '1990-01-01T00:00:00Z' },
  { id: 't1', nom: 'Douala I', niveau: 'district', code: 'DLA-1', parent_id: 't0', actif: true, created_at: '1995-03-15T00:00:00Z' },
  { id: 't2', nom: 'Yaounde Centre', niveau: 'district', code: 'YDE-C', parent_id: 't0', actif: true, created_at: '1995-03-15T00:00:00Z' },
  { id: 't3', nom: 'Bamenda', niveau: 'district', code: 'BDA', parent_id: 't0', actif: true, created_at: '1998-06-20T00:00:00Z' },
  { id: 't4', nom: 'Bafoussam', niveau: 'district', code: 'BFS', parent_id: 't0', actif: true, created_at: '1999-09-10T00:00:00Z' },
  { id: 't5', nom: 'Garoua', niveau: 'district', code: 'GAR', parent_id: 't0', actif: true, created_at: '2001-01-25T00:00:00Z' },
  { id: 't6', nom: 'Maroua', niveau: 'district', code: 'MAR', parent_id: 't0', actif: true, created_at: '2002-04-18T00:00:00Z' },
  { id: 't7', nom: 'Douala Akwa', niveau: 'eglise_locale', code: 'DLA-1-AK', parent_id: 't1', actif: true, created_at: '2000-07-01T00:00:00Z' },
  { id: 't8', nom: 'Douala Bonaberi', niveau: 'eglise_locale', code: 'DLA-1-BN', parent_id: 't1', actif: true, created_at: '2003-11-15T00:00:00Z' },
];

export const mockServiteurs: Serviteur[] = [
  { id: 's1', personne_id: '1', personne_nom: 'Mbarga Jean-Pierre', grade: 'Pasteur', territoire_id: 't1', territoire_nom: 'Douala I', date_promotion: '2015-06-10', statut: 'actif', created_at: '2015-06-10T00:00:00Z' },
  { id: 's2', personne_id: '3', personne_nom: 'Essomba Paul', grade: 'Ancien', territoire_id: 't2', territoire_nom: 'Yaounde Centre', date_promotion: '2012-03-20', statut: 'actif', created_at: '2012-03-20T00:00:00Z' },
  { id: 's3', personne_id: '7', personne_nom: 'Fotso Daniel', grade: 'Diacre', territoire_id: 't4', territoire_nom: 'Bafoussam', date_promotion: '2018-09-15', statut: 'actif', created_at: '2018-09-15T00:00:00Z' },
  { id: 's4', personne_id: '9', personne_nom: 'Tchinda Emmanuel', grade: 'Evangliste', territoire_id: 't5', territoire_nom: 'Garoua', date_promotion: '2010-01-05', statut: 'actif', created_at: '2010-01-05T00:00:00Z' },
  { id: 's5', personne_id: '11', personne_nom: 'Owona Pierre', grade: 'Missionnaire', territoire_id: 't1', territoire_nom: 'Douala I', date_promotion: '2020-11-20', statut: 'actif', created_at: '2020-11-20T00:00:00Z' },
  { id: 's6', personne_id: '5', personne_nom: 'Nkoulou Samuel', grade: 'Ancien', territoire_id: 't3', territoire_nom: 'Bamenda', date_promotion: '2016-07-14', statut: 'actif', created_at: '2016-07-14T00:00:00Z' },
];

export const mockTransferts: Transfert[] = [
  { id: 'tr1', personne_id: '5', personne_nom: 'Nkoulou Samuel', territoire_origine: 'Douala I', territoire_destination: 'Bamenda', statut: 'valide', date_demande: '2024-01-10', date_validation: '2024-01-12', motif: 'Mutation professionnelle' },
  { id: 'tr2', personne_id: '2', personne_nom: 'Ngono Marie-Claire', territoire_origine: 'Douala I', territoire_destination: 'Yaounde Centre', statut: 'en_attente', date_demande: '2024-01-14', motif: 'Rapprochement familial' },
  { id: 'tr3', personne_id: '8', personne_nom: 'Kamga Ruth', territoire_origine: 'Bafoussam', territoire_destination: 'Douala I', statut: 'en_attente', date_demande: '2024-01-15', motif: 'Etudes universitaires' },
  { id: 'tr4', personne_id: '6', personne_nom: 'Biyik Esther', territoire_origine: 'Bamenda', territoire_destination: 'Garoua', statut: 'rejete', date_demande: '2024-01-05', motif: 'Demande personnelle' },
];

export const mockUtilisateurs: Utilisateur[] = [
  { id: 'u1', email: 'admin@vedc.cm', nom_complet: 'Administrateur National', role: 'super_admin', territoire_id: 't0', actif: true, derniere_connexion: '2024-01-15T14:30:00Z', created_at: '2020-01-01T00:00:00Z' },
  { id: 'u2', email: 'regional.douala@vedc.cm', nom_complet: 'Admin Regional Douala', role: 'admin_regional', territoire_id: 't1', actif: true, derniere_connexion: '2024-01-15T10:00:00Z', created_at: '2021-03-15T00:00:00Z' },
  { id: 'u3', email: 'local.yde@vedc.cm', nom_complet: 'Secretaire Yaounde', role: 'admin_local', territoire_id: 't2', actif: true, derniere_connexion: '2024-01-14T16:45:00Z', created_at: '2022-06-01T00:00:00Z' },
  { id: 'u4', email: 'lecteur@vedc.cm', nom_complet: 'Utilisateur Lecture', role: 'lecteur', territoire_id: 't3', actif: true, derniere_connexion: '2024-01-13T09:20:00Z', created_at: '2023-01-10T00:00:00Z' },
  { id: 'u5', email: 'inactif@vedc.cm', nom_complet: 'Compte Inactif', role: 'admin_local', territoire_id: 't4', actif: false, derniere_connexion: '2023-11-01T08:00:00Z', created_at: '2021-09-20T00:00:00Z' },
];

export const mockJournal: JournalEntry[] = [
  { id: 'j1', action: 'CREATE_PERSONNE', utilisateur: 'Admin Regional Douala', ressource: 'Personne #13', details: 'Nouveau membre cree', timestamp: '2024-01-15T14:30:00Z', ip_address: '192.168.1.100' },
  { id: 'j2', action: 'VALIDER_TRANSFERT', utilisateur: 'Admin National', ressource: 'Transfert #tr1', details: 'Transfert valide', timestamp: '2024-01-15T13:15:00Z', ip_address: '192.168.1.50' },
  { id: 'j3', action: 'PROMOTION', utilisateur: 'Super Admin', ressource: 'Serviteur #s5', details: 'Promotion au grade de Missionnaire', timestamp: '2024-01-15T11:45:00Z', ip_address: '192.168.1.10' },
  { id: 'j4', action: 'CREATE_TERRITOIRE', utilisateur: 'Admin National', ressource: 'Territoire #t9', details: 'Nouveau territoire cree', timestamp: '2024-01-15T10:20:00Z', ip_address: '192.168.1.10' },
  { id: 'j5', action: 'UPDATE_PERSONNE', utilisateur: 'Secretaire Local', ressource: 'Personne #4', details: 'Modification fiche membre', timestamp: '2024-01-15T09:00:00Z', ip_address: '192.168.1.200' },
  { id: 'j6', action: 'LOGIN', utilisateur: 'Admin Regional Douala', ressource: 'Auth', details: 'Connexion reussie', timestamp: '2024-01-15T08:30:00Z', ip_address: '192.168.1.100' },
  { id: 'j7', action: 'CREATE_NOTE', utilisateur: 'Pasteur', ressource: 'Note #n1', details: 'Note confidentielle ajoutee', timestamp: '2024-01-14T16:00:00Z', ip_address: '192.168.1.150' },
  { id: 'j8', action: 'DELETE_SERVITEUR', utilisateur: 'Super Admin', ressource: 'Serviteur #s10', details: 'Serviteur archive', timestamp: '2024-01-14T14:20:00Z', ip_address: '192.168.1.10' },
];
