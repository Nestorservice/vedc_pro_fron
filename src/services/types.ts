// ============================================================================
// VEDC API — Strict TypeScript Interfaces (derived from OpenAPI schema)
// ============================================================================

// --- Envelope & Meta ---
export interface Meta {
  page?: number;
  par_page?: number;
  total?: number;
  total_pages?: number;
}

export interface Enveloppe<T> {
  donnees: T;
  meta?: Meta;
}

// --- Error ---
export interface ErreurDetail {
  [key: string]: string;
}

export interface ErreurReponse {
  erreur: {
    code: string;
    message: string;
    details?: ErreurDetail;
    requete_id: string;
  };
}

// --- Enums ---
export type NiveauTerritoire = 'pays' | 'region' | 'departement' | 'district' | 'eglise_locale' | 'circonscription';
export type RoleUtilisateur = 'super_admin' | 'admin_national' | 'admin_regional' | 'admin_local' | 'lecteur';
export type Sexe = 'M' | 'F';
export type StatutPersonne = 'actif' | 'inactif' | 'transfere';
export type SituationMatrimoniale = 'celibataire' | 'marie' | 'divorce' | 'veuf';
export type TypeAffectation = 'adhesion' | 'transfert' | 'reintegration';
export type StatutTransfert = 'en_attente' | 'valide' | 'rejete' | 'annule';
export type GradeServiteur = 'pasteur' | 'ancien' | 'diacre' | 'evangliste' | 'missionnaire' | 'monitor';
export type StatutServiteur = 'actif' | 'inactif';
export type Sensibilite = 'standard' | 'confidentiel' | 'restreint';
export type ActionAudit = 'CREATE_PERSONNE' | 'UPDATE_PERSONNE' | 'DELETE_PERSONNE' | 'LOGIN' | 'LOGOUT' | 'CREATE_TERRITOIRE' | 'UPDATE_TERRITOIRE' | 'DELETE_TERRITOIRE' | 'VALIDER_TRANSFERT' | 'REJETER_TRANSFERT' | 'PROMOTION' | 'CREATE_NOTE' | 'UPDATE_NOTE' | 'DELETE_NOTE' | 'CREATE_SERVITEUR' | 'DELETE_SERVITEUR' | 'CREATE_UTILISATEUR' | 'UPDATE_UTILISATEUR' | 'DELETE_UTILISATEUR' | 'EXPORT_RAPPORT';

// --- Auth ---
export interface DemandeConnexion {
  email: string;
  mot_de_passe: string;
}

export interface ReponseJetons {
  jeton_acces: string;
  jeton_raffraichissement: string;
  type: string;
  expire_dans: number;
}

export interface Profil {
  id: string;
  email: string;
  nom_complet: string;
  role: RoleUtilisateur;
  territoire_id: string;
  territoire_nom: string;
  permissions: string[];
  actif: boolean;
  derniere_connexion: string;
  cree_le: string;
}

// --- Territoire ---
export interface Territoire {
  id: string;
  nom: string;
  niveau: NiveauTerritoire;
  code: string;
  parent_id: string | null;
  parent_nom: string | null;
  actif: boolean;
  cree_le: string;
  modifie_le: string;
}

export interface TerritoireArbre {
  id: string;
  nom: string;
  niveau: NiveauTerritoire;
  code: string;
  parent_id: string | null;
  profondeur: number;
  actif: boolean;
}

export interface EntreeCreationTerritoire {
  nom: string;
  niveau: NiveauTerritoire;
  code: string;
  parent_id?: string;
}

export interface EntreeModificationTerritoire {
  nom?: string;
  code?: string;
}

// --- Personne ---
export interface Personne {
  id: string;
  nom: string;
  prenom: string;
  sexe: Sexe;
  date_naissance: string;
  telephone1: string | null;
  telephone2: string | null;
  email: string | null;
  situation_matrimoniale: SituationMatrimoniale | null;
  statut: StatutPersonne;
  territoire_id: string;
  territoire_nom: string;
  date_adhesion: string;
  cree_le: string;
  modifie_le: string;
}

export interface EntreeCreationPersonne {
  nom: string;
  prenom: string;
  sexe: Sexe;
  date_naissance: string;
  telephone1?: string;
  telephone2?: string;
  email?: string;
  situation_matrimoniale?: SituationMatrimoniale;
  territoire_id: string;
  date_adhesion: string;
}

export interface EntreeModificationPersonne {
  nom?: string;
  prenom?: string;
  sexe?: Sexe;
  date_naissance?: string;
  telephone1?: string;
  telephone2?: string;
  email?: string;
  situation_matrimoniale?: SituationMatrimoniale;
  territoire_id?: string;
}

// --- Affectation ---
export interface Affectation {
  id: string;
  personne_id: string;
  territoire_id: string;
  territoire_nom: string;
  type: TypeAffectation;
  date_debut: string;
  date_fin: string | null;
  actif: boolean;
  cree_le: string;
}

export interface AffectationDetaillee extends Affectation {
  personne_nom: string;
  personne_prenom: string;
}

export interface DossierAffectations {
  personne_id: string;
  personne_nom: string;
  affectations: AffectationDetaillee[];
  affectation_courante: AffectationDetaillee | null;
}

export interface EntreeAffectation {
  territoire_id: string;
  type: TypeAffectation;
  date_debut: string;
}

// --- Transfert ---
export interface Transfert {
  id: string;
  personne_id: string;
  personne_nom: string;
  personne_prenom: string;
  territoire_origine_id: string;
  territoire_origine_nom: string;
  territoire_destination_id: string;
  territoire_destination_nom: string;
  statut: StatutTransfert;
  motif: string;
  date_demande: string;
  date_validation: string | null;
  valide_par: string | null;
  cree_le: string;
}

export interface EntreeTransfert {
  personne_id: string;
  territoire_destination_id: string;
  motif: string;
}

// --- Serviteur ---
export interface Serviteur {
  id: string;
  personne_id: string;
  personne_nom: string;
  personne_prenom: string;
  grade: GradeServiteur;
  territoire_id: string;
  territoire_nom: string;
  date_promotion: string;
  statut: StatutServiteur;
  cree_le: string;
  modifie_le: string;
}

export interface GradeHistorique {
  grade: GradeServiteur;
  date_debut: string;
  date_fin: string | null;
  actuel: boolean;
}

export interface ResponsabiliteServiteur {
  id: string;
  responsabilite_id: string;
  responsabilite_nom: string;
  serviteur_id: string;
  territoire_id: string;
  date_debut: string;
  date_fin: string | null;
  actif: boolean;
}

export interface DossierServiteur {
  serviteur: Serviteur;
  historique_grades: GradeHistorique[];
  responsabilites: ResponsabiliteServiteur[];
}

export interface EntreeCreationServiteur {
  personne_id: string;
  grade: GradeServiteur;
  territoire_id: string;
  date_promotion: string;
}

export interface EntreeModificationServiteur {
  grade?: GradeServiteur;
  territoire_id?: string;
  statut?: StatutServiteur;
}

export interface EntreePromotion {
  nouveau_grade: GradeServiteur;
  date_effet: string;
  motif: string;
}

// --- Responsabilite ---
export interface Responsabilite {
  id: string;
  nom: string;
  description: string;
  niveau_minimal: GradeServiteur;
  cree_le: string;
}

export interface EntreeCreationResponsabilite {
  nom: string;
  description: string;
  niveau_minimal: GradeServiteur;
}

export interface EntreeAffectationResponsabilite {
  responsabilite_id: string;
  territoire_id: string;
  date_debut: string;
}

// --- Promotion ---
export interface Promotion {
  id: string;
  serviteur_id: string;
  serviteur_nom: string;
  ancien_grade: GradeServiteur;
  nouveau_grade: GradeServiteur;
  date_effet: string;
  motif: string;
  cree_le: string;
}

export interface RepartitionGrade {
  grade: GradeServiteur;
  nombre: number;
  pourcentage: number;
}

// --- Notes & Documents ---
export interface Note {
  id: string;
  personne_id: string;
  auteur_id: string;
  auteur_nom: string;
  contenu: string;
  sensibilite: Sensibilite;
  cree_le: string;
  modifie_le: string;
}

export interface EntreeNote {
  contenu: string;
  sensibilite: Sensibilite;
}

export interface Document {
  id: string;
  personne_id: string;
  nom_fichier: string;
  type_mime: string;
  taille_octets: number;
  sensibilite: Sensibilite;
  televerse_par: string;
  cree_le: string;
}

// --- Rapports ---
export interface TableauDeBord {
  total_membres: number;
  total_serviteurs: number;
  total_territoires: number;
  transferts_en_attente: number;
  nouveaux_membres_mois: number;
  croissance_annuelle: number;
}

export interface EffectifParTerritoire {
  territoire_id: string;
  territoire_nom: string;
  effectif: number;
}

export interface RapportEffectifs {
  periode: string;
  territoires: EffectifParTerritoire[];
  total_general: number;
}

export interface RapportDemographie {
  periode: string;
  repartition_sexe: { sexe: Sexe; nombre: number }[];
  repartition_age: { tranche: string; nombre: number }[];
  repartition_matrimoniale: { situation: SituationMatrimoniale; nombre: number }[];
}

export interface MouvementMensuel {
  mois: string;
  entrees: number;
  sorties: number;
  transferts: number;
}

export interface RapportMouvements {
  annee: number;
  mouvements: MouvementMensuel[];
}

export interface RapportServiteurs {
  periode: string;
  par_grade: RepartitionGrade[];
  par_territoire: { territoire_nom: string; grades: { grade: GradeServiteur; nombre: number }[] }[];
}

export interface DescriptionRapport {
  id: string;
  nom: string;
  description: string;
  format_disponible: string[];
}

// --- Journal d'audit ---
export interface EntreeJournal {
  id: string;
  action: ActionAudit;
  utilisateur_id: string;
  utilisateur_nom: string;
  ressource_type: string;
  ressource_id: string;
  details: string;
  adresse_ip: string;
  timestamp: string;
}

export interface JournalParAction {
  action: ActionAudit;
  nombre: number;
}

export interface JournalConsultations {
  utilisateur_nom: string;
  nombre_consultations: number;
}

// --- Utilisateurs ---
export interface Compte {
  id: string;
  email: string;
  nom_complet: string;
  role: RoleUtilisateur;
  territoire_id: string;
  territoire_nom: string;
  actif: boolean;
  derniere_connexion: string | null;
  cree_le: string;
  modifie_le: string;
}

export interface EntreeCreationUtilisateur {
  email: string;
  nom_complet: string;
  role: RoleUtilisateur;
  territoire_id: string;
  mot_de_passe: string;
}

export interface EntreeModificationUtilisateur {
  email?: string;
  nom_complet?: string;
  role?: RoleUtilisateur;
  territoire_id?: string;
  actif?: boolean;
}

export interface DerogationPermission {
  permission: string;
  accordee: boolean;
  accordee_par: string;
  date_derogation: string;
}

export interface DossierPermissions {
  utilisateur_id: string;
  permissions_role: string[];
  derogations: DerogationPermission[];
  permissions_effectives: string[];
}

export interface PermissionCatalogue {
  code: string;
  description: string;
  module: string;
}

// --- Import ---
export interface RapportImport {
  total_lignes: number;
  lignes_reussies: number;
  lignes_echouees: number;
  erreurs: { ligne: number; champ: string; message: string }[];
}
