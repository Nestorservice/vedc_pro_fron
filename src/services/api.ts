// ============================================================================
// VEDC API — Centralized HTTP Client (Production Backend)
// ============================================================================

import type {
  Enveloppe, ErreurReponse, Meta,
  DemandeConnexion, ReponseJetons, Profil,
  Territoire, TerritoireArbre, EntreeCreationTerritoire, EntreeModificationTerritoire,
  Personne, EntreeCreationPersonne, EntreeModificationPersonne,
  AffectationDetaillee, DossierAffectations, EntreeAffectation,
  Transfert, EntreeTransfert,
  Serviteur, EntreeCreationServiteur, EntreeModificationServiteur, EntreePromotion,
  RepartitionGrade, Promotion, DossierServiteur,
  Responsabilite, EntreeCreationResponsabilite, EntreeAffectationResponsabilite, ResponsabiliteServiteur,
  Note, EntreeNote,
  Document,
  TableauDeBord, RapportEffectifs, RapportDemographie, RapportMouvements, RapportServiteurs,
  DescriptionRapport,
  EntreeJournal, JournalParAction, JournalConsultations,
  Compte, EntreeCreationUtilisateur, EntreeModificationUtilisateur,
  DossierPermissions, PermissionCatalogue,
  RapportImport,
} from './types';

// --- Configuration ---
const API_BASE_URL = 'https://vedc-api-production.up.railway.app/api/v1';
const USE_MOCK_DATA = true; // Mode démo activé par défaut

// Import mock data
import {
  mockDashboard,
  mockPersonnes,
  mockTerritoires,
  mockServiteurs,
  mockTransferts,
  mockComptes,
  mockJournal,
} from './mockData';

// --- Error Classes ---
export class ApiError extends Error {
  code: string;
  status: number;
  details?: Record<string, string>;
  requestId: string;

  constructor(err: ErreurReponse['erreur'], status: number) {
    super(err.message);
    this.name = 'ApiError';
    this.code = err.code;
    this.status = status;
    this.details = err.details;
    this.requestId = err.requete_id;
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class CorsError extends Error {
  constructor(url: string) {
    super(`Requete bloquee par la politique CORS. Le serveur a ${url} ne semble pas autoriser les requetes depuis ce domaine. Verifiez la configuration du serveur ou utilisez un proxy.`);
    this.name = 'CorsError';
  }
}

// --- Token Management ---
const TOKEN_KEY = 'vedc_access_token';
const REFRESH_KEY = 'vedc_refresh_token';

function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setTokens(access: string, refresh: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  } catch {
    // localStorage unavailable
  }
}

function clearTokens(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  } catch {
    // localStorage unavailable
  }
}

function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_KEY);
  } catch {
    return null;
  }
}

// --- Core Fetch Wrapper ---
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<Enveloppe<T>> {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 - attempt token refresh
    if (response.status === 401 && token) {
      const refreshed = await attemptTokenRefresh();
      if (refreshed) {
        // Retry original request with new token
        const retryHeaders = { ...headers, Authorization: `Bearer ${getToken()}` };
        const retryResponse = await fetch(url, { ...options, headers: retryHeaders });
        return handleResponse<T>(retryResponse);
      } else {
        clearTokens();
        throw new ApiError({
          code: 'SESSION_EXPIREE',
          message: 'Votre session a expire. Veuillez vous reconnecter.',
          requete_id: '',
        }, 401);
      }
    }

    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;

    // Detect CORS errors
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new CorsError(url);
    }

    if (error instanceof TypeError) {
      throw new NetworkError('Impossible de se connecter au serveur. Verifiez votre connexion internet.');
    }

    throw error;
  }
}

async function handleResponse<T>(response: Response): Promise<Enveloppe<T>> {
  if (!response.ok) {
    let errorData: ErreurReponse;
    try {
      errorData = await response.json();
    } catch {
      throw new ApiError({
        code: 'ERREUR_SERVEUR',
        message: `Erreur serveur (${response.status}). Veuillez reessayer plus tard.`,
        requete_id: '',
      }, response.status);
    }
    throw new ApiError(errorData.erreur, response.status);
  }

  // 204 No Content
  if (response.status === 204) {
    return { donnees: null as unknown as T };
  }

  const data: Enveloppe<T> = await response.json();
  return data;
}

async function attemptTokenRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/rafraichir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jeton_raffraichissement: refreshToken }),
    });

    if (!response.ok) return false;

    const data: Enveloppe<ReponseJetons> = await response.json();
    setTokens(data.donnees.jeton_acces, data.donnees.jeton_raffraichissement);
    return true;
  } catch {
    return false;
  }
}

// --- Query Params Helper ---
function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '');
  if (entries.length === 0) return '';
  return '?' + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}

// ============================================================================
// API MODULES — Mapped to Swagger endpoints
// ============================================================================

export const api = {
  // --- Auth ---
  auth: {
    login: async (data: DemandeConnexion): Promise<Enveloppe<ReponseJetons>> => {
      if (USE_MOCK_DATA) {
        // Mode démo - accepter n'importe quel identifiant
        const mockTokens: ReponseJetons = {
          jeton_acces: 'mock-access-token-demo',
          jeton_raffraichissement: 'mock-refresh-token-demo',
          type: 'Bearer',
          expire_dans: 3600,
        };
        setTokens(mockTokens.jeton_acces, mockTokens.jeton_raffraichissement);
        return { donnees: mockTokens };
      }
      
      const result = await request<ReponseJetons>('/auth/connexion', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setTokens(result.donnees.jeton_acces, result.donnees.jeton_raffraichissement);
      return result;
    },

    refresh: async (): Promise<Enveloppe<ReponseJetons>> => {
      if (USE_MOCK_DATA) {
        const mockTokens: ReponseJetons = {
          jeton_acces: 'mock-access-token-demo',
          jeton_raffraichissement: 'mock-refresh-token-demo',
          type: 'Bearer',
          expire_dans: 3600,
        };
        return { donnees: mockTokens };
      }
      
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new NetworkError('Pas de token de rafraichissement');
      return request<ReponseJetons>('/auth/rafraichir', {
        method: 'POST',
        body: JSON.stringify({ jeton_raffraichissement: refreshToken }),
      });
    },

    logout: async (): Promise<void> => {
      if (USE_MOCK_DATA) {
        clearTokens();
        return;
      }
      
      try {
        await request('/auth/deconnexion', { method: 'POST' });
      } finally {
        clearTokens();
      }
    },

    getProfile: async (): Promise<Enveloppe<Profil>> => {
      if (USE_MOCK_DATA) {
        const mockProfil: Profil = {
          id: 'u1',
          email: 'admin@vedc.cm',
          nom_complet: 'Administrateur Principal',
          role: 'super_admin',
          territoire_id: 't1',
          territoire_nom: 'Douala Centre',
          permissions: ['LECTURE_MEMBRES', 'ECRITURE_MEMBRES', 'GESTION_TERRITOIRES'],
          actif: true,
          derniere_connexion: new Date().toISOString(),
          cree_le: '2020-01-01T00:00:00Z',
        };
        return { donnees: mockProfil };
      }
      
      return request<Profil>('/auth/moi');
    },
  },

  // --- Territoires ---
  territoires: {
    list: async (params?: { page?: number; par_page?: number; niveau?: string; recherche?: string }): Promise<Enveloppe<Territoire[]>> => {
      if (USE_MOCK_DATA) {
        return { 
          donnees: mockTerritoires,
          meta: { total: mockTerritoires.length, page: 1, par_page: 10 }
        };
      }
      const qs = buildQueryString(params as Record<string, string | number | undefined>);
      return request<Territoire[]>(`/territoires${qs}`);
    },

    getTree: async (): Promise<Enveloppe<TerritoireArbre[]>> => {
      if (USE_MOCK_DATA) {
        return { donnees: [] };
      }
      return request<TerritoireArbre[]>('/territoires/arbre');
    },

    get: async (id: string): Promise<Enveloppe<Territoire>> => {
      if (USE_MOCK_DATA) {
        const terr = mockTerritoires.find(t => t.id === id);
        if (!terr) throw new ApiError({ code: 'RESSOURCE_INTROUVABLE', message: 'Territoire introuvable', requete_id: '' }, 404);
        return { donnees: terr };
      }
      return request<Territoire>(`/territoires/${id}`);
    },

    create: async (data: EntreeCreationTerritoire): Promise<Enveloppe<Territoire>> => {
      if (USE_MOCK_DATA) {
        const newTerr: Territoire = {
          id: `t${Date.now()}`,
          nom: data.nom,
          niveau: data.niveau,
          code: data.code,
          parent_id: data.parent_id || null,
          parent_nom: null,
          actif: true,
          cree_le: new Date().toISOString(),
          modifie_le: new Date().toISOString(),
        };
        return { donnees: newTerr };
      }
      return request<Territoire>('/territoires', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: string, data: EntreeModificationTerritoire): Promise<Enveloppe<Territoire>> => {
      if (USE_MOCK_DATA) {
        const terr = mockTerritoires.find(t => t.id === id);
        if (!terr) throw new ApiError({ code: 'RESSOURCE_INTROUVABLE', message: 'Territoire introuvable', requete_id: '' }, 404);
        return { donnees: { ...terr, ...data, modifie_le: new Date().toISOString() } };
      }
      return request<Territoire>(`/territoires/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },

    archive: async (id: string): Promise<void> => {
      if (USE_MOCK_DATA) return;
      await request(`/territoires/${id}`, { method: 'DELETE' });
    },

    getDescendants: async (id: string): Promise<Enveloppe<TerritoireArbre[]>> => {
      if (USE_MOCK_DATA) return { donnees: [] };
      return request<TerritoireArbre[]>(`/territoires/${id}/descendants`);
    },

    setActivation: async (id: string, actif: boolean): Promise<Enveloppe<Territoire>> => {
      if (USE_MOCK_DATA) {
        const terr = mockTerritoires.find(t => t.id === id);
        if (!terr) throw new ApiError({ code: 'RESSOURCE_INTROUVABLE', message: 'Territoire introuvable', requete_id: '' }, 404);
        return { donnees: { ...terr, actif, modifie_le: new Date().toISOString() } };
      }
      return request<Territoire>(`/territoires/${id}/activation`, {
        method: 'PUT',
        body: JSON.stringify({ actif }),
      });
    },
  },

  // --- Personnes ---
  personnes: {
    list: async (params?: { page?: number; par_page?: number; recherche?: string; territoire_id?: string; statut?: string }): Promise<Enveloppe<Personne[]>> => {
      if (USE_MOCK_DATA) {
        let filtered = [...mockPersonnes];
        if (params?.recherche) {
          const search = params.recherche.toLowerCase();
          filtered = filtered.filter(p => 
            p.nom.toLowerCase().includes(search) || 
            p.prenom.toLowerCase().includes(search)
          );
        }
        return { 
          donnees: filtered,
          meta: { total: filtered.length, page: params?.page || 1, par_page: params?.par_page || 10 }
        };
      }
      const qs = buildQueryString(params as Record<string, string | number | undefined>);
      return request<Personne[]>(`/personnes${qs}`);
    },

    get: async (id: string): Promise<Enveloppe<Personne>> => {
      if (USE_MOCK_DATA) {
        const person = mockPersonnes.find(p => p.id === id);
        if (!person) throw new ApiError({ code: 'RESSOURCE_INTROUVABLE', message: 'Personne introuvable', requete_id: '' }, 404);
        return { donnees: person };
      }
      return request<Personne>(`/personnes/${id}`);
    },

    create: async (data: EntreeCreationPersonne): Promise<Enveloppe<Personne>> => {
      if (USE_MOCK_DATA) {
        const newPerson = {
          id: String(Date.now()),
          nom: data.nom,
          prenom: data.prenom,
          sexe: data.sexe,
          date_naissance: data.date_naissance,
          telephone1: data.telephone1 || null,
          telephone2: null,
          email: data.email || null,
          situation_matrimoniale: data.situation_matrimoniale || null,
          statut: 'actif' as const,
          territoire_id: data.territoire_id,
          territoire_nom: 'Douala Centre',
          date_adhesion: data.date_adhesion,
          cree_le: new Date().toISOString(),
          modifie_le: new Date().toISOString(),
        };
        return { donnees: newPerson };
      }
      return request<Personne>('/personnes', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: string, data: EntreeModificationPersonne): Promise<Enveloppe<Personne>> => {
      if (USE_MOCK_DATA) {
        const person = mockPersonnes.find(p => p.id === id);
        if (!person) throw new ApiError({ code: 'RESSOURCE_INTROUVABLE', message: 'Personne introuvable', requete_id: '' }, 404);
        return { donnees: { ...person, ...data, modifie_le: new Date().toISOString() } };
      }
      return request<Personne>(`/personnes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },

    archive: async (id: string): Promise<void> => {
      if (USE_MOCK_DATA) return;
      await request(`/personnes/${id}`, { method: 'DELETE' });
    },
  },

  // --- Affectations ---
  affectations: {
    getDossier: async (personneId: string): Promise<Enveloppe<DossierAffectations>> => {
      return request<DossierAffectations>(`/personnes/${personneId}/affectations`);
    },

    create: async (personneId: string, data: EntreeAffectation): Promise<Enveloppe<AffectationDetaillee>> => {
      return request<AffectationDetaillee>(`/personnes/${personneId}/affectations`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  // --- Transferts ---
  transferts: {
    list: async (params?: { page?: number; par_page?: number; statut?: string }): Promise<Enveloppe<Transfert[]>> => {
      if (USE_MOCK_DATA) {
        let filtered = [...mockTransferts];
        if (params?.statut) {
          filtered = filtered.filter(t => t.statut === params.statut);
        }
        return { 
          donnees: filtered,
          meta: { total: filtered.length, page: 1, par_page: 10 }
        };
      }
      const qs = buildQueryString(params as Record<string, string | number | undefined>);
      return request<Transfert[]>(`/transferts${qs}`);
    },

    get: async (id: string): Promise<Enveloppe<Transfert>> => {
      if (USE_MOCK_DATA) {
        const tr = mockTransferts.find(t => t.id === id);
        if (!tr) throw new ApiError({ code: 'RESSOURCE_INTROUVABLE', message: 'Transfert introuvable', requete_id: '' }, 404);
        return { donnees: tr };
      }
      return request<Transfert>(`/transferts/${id}`);
    },

    getPendingCount: async (): Promise<Enveloppe<{ nombre: number }>> => {
      if (USE_MOCK_DATA) {
        const count = mockTransferts.filter(t => t.statut === 'en_attente').length;
        return { donnees: { nombre: count } };
      }
      return request<{ nombre: number }>('/transferts/nombre-en-attente');
    },

    create: async (data: EntreeTransfert): Promise<Enveloppe<Transfert>> => {
      return request<Transfert>('/transferts', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    validate: async (id: string): Promise<Enveloppe<Transfert>> => {
      return request<Transfert>(`/transferts/${id}/validation`, { method: 'POST' });
    },

    reject: async (id: string, motif?: string): Promise<Enveloppe<Transfert>> => {
      return request<Transfert>(`/transferts/${id}/rejet`, {
        method: 'POST',
        body: JSON.stringify({ motif }),
      });
    },

    cancel: async (id: string): Promise<Enveloppe<Transfert>> => {
      return request<Transfert>(`/transferts/${id}/annulation`, { method: 'POST' });
    },
  },

  // --- Serviteurs ---
  serviteurs: {
    list: async (params?: { page?: number; par_page?: number; grade?: string; territoire_id?: string }): Promise<Enveloppe<Serviteur[]>> => {
      if (USE_MOCK_DATA) {
        return { 
          donnees: mockServiteurs,
          meta: { total: mockServiteurs.length, page: 1, par_page: 10 }
        };
      }
      const qs = buildQueryString(params as Record<string, string | number | undefined>);
      return request<Serviteur[]>(`/serviteurs${qs}`);
    },

    get: async (id: string): Promise<Enveloppe<Serviteur>> => {
      if (USE_MOCK_DATA) {
        const serv = mockServiteurs.find(s => s.id === id);
        if (!serv) throw new ApiError({ code: 'RESSOURCE_INTROUVABLE', message: 'Serviteur introuvable', requete_id: '' }, 404);
        return { donnees: serv };
      }
      return request<Serviteur>(`/serviteurs/${id}`);
    },

    getStats: async (): Promise<Enveloppe<RepartitionGrade[]>> => {
      if (USE_MOCK_DATA) {
        return {
          donnees: [
            { grade: 'diacre', nombre: 35, pourcentage: 39.3 },
            { grade: 'ancien', nombre: 28, pourcentage: 31.5 },
            { grade: 'pasteur', nombre: 15, pourcentage: 16.9 },
            { grade: 'evangliste', nombre: 11, pourcentage: 12.3 },
          ]
        };
      }
      return request<RepartitionGrade[]>('/serviteurs/statistiques');
    },

    create: async (data: EntreeCreationServiteur): Promise<Enveloppe<Serviteur>> => {
      return request<Serviteur>('/serviteurs', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: string, data: EntreeModificationServiteur): Promise<Enveloppe<Serviteur>> => {
      return request<Serviteur>(`/serviteurs/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },

    archive: async (id: string): Promise<void> => {
      await request(`/serviteurs/${id}`, { method: 'DELETE' });
    },

    getDossier: async (id: string): Promise<Enveloppe<DossierServiteur>> => {
      return request<DossierServiteur>(`/serviteurs/${id}/dossier`);
    },

    promote: async (id: string, data: EntreePromotion): Promise<Enveloppe<Serviteur>> => {
      return request<Serviteur>(`/serviteurs/${id}/promotion`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    getResponsabilites: async (id: string): Promise<Enveloppe<ResponsabiliteServiteur[]>> => {
      return request<ResponsabiliteServiteur[]>(`/serviteurs/${id}/responsabilites`);
    },

    assignResponsabilite: async (id: string, data: EntreeAffectationResponsabilite): Promise<Enveloppe<ResponsabiliteServiteur>> => {
      return request<ResponsabiliteServiteur>(`/serviteurs/${id}/responsabilites`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    removeResponsabilite: async (serviteurId: string, rid: string): Promise<void> => {
      await request(`/serviteurs/${serviteurId}/responsabilites/${rid}`, { method: 'DELETE' });
    },
  },

  // --- Promotions & Responsabilites ---
  promotions: {
    list: async (params?: { page?: number; par_page?: number }): Promise<Enveloppe<Promotion[]>> => {
      const qs = buildQueryString(params as Record<string, number | undefined>);
      return request<Promotion[]>(`/promotions${qs}`);
    },
  },

  responsabilites: {
    list: async (): Promise<Enveloppe<Responsabilite[]>> => {
      return request<Responsabilite[]>('/responsabilites');
    },

    create: async (data: EntreeCreationResponsabilite): Promise<Enveloppe<Responsabilite>> => {
      return request<Responsabilite>('/responsabilites', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: string, data: Partial<EntreeCreationResponsabilite>): Promise<Enveloppe<Responsabilite>> => {
      return request<Responsabilite>(`/responsabilites/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
  },

  // --- Notes & Documents ---
  notes: {
    list: async (personneId: string): Promise<Enveloppe<Note[]>> => {
      return request<Note[]>(`/personnes/${personneId}/notes`);
    },

    create: async (personneId: string, data: EntreeNote): Promise<Enveloppe<Note>> => {
      return request<Note>(`/personnes/${personneId}/notes`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    get: async (id: string): Promise<Enveloppe<Note>> => {
      return request<Note>(`/notes/${id}`);
    },

    update: async (id: string, data: Partial<EntreeNote>): Promise<Enveloppe<Note>> => {
      return request<Note>(`/notes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },

    archive: async (id: string): Promise<void> => {
      await request(`/notes/${id}`, { method: 'DELETE' });
    },
  },

  documents: {
    list: async (personneId: string): Promise<Enveloppe<Document[]>> => {
      return request<Document[]>(`/personnes/${personneId}/documents`);
    },

    upload: async (personneId: string, file: File): Promise<Enveloppe<Document>> => {
      const formData = new FormData();
      formData.append('fichier', file);
      const token = getToken();
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/personnes/${personneId}/documents`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.erreur, response.status);
      }
      return response.json();
    },

    get: async (id: string): Promise<Enveloppe<Document>> => {
      return request<Document>(`/documents/${id}`);
    },

    archive: async (id: string): Promise<void> => {
      await request(`/documents/${id}`, { method: 'DELETE' });
    },

    download: async (id: string): Promise<Blob> => {
      const token = getToken();
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/documents/${id}/contenu`, { headers });
      if (!response.ok) throw new NetworkError('Echec du telechargement');
      return response.blob();
    },
  },

  // --- Rapports ---
  rapports: {
    getCatalogue: async (): Promise<Enveloppe<DescriptionRapport[]>> => {
      if (USE_MOCK_DATA) {
        return { donnees: [] };
      }
      return request<DescriptionRapport[]>('/rapports/catalogue');
    },

    getDashboard: async (): Promise<Enveloppe<TableauDeBord>> => {
      if (USE_MOCK_DATA) {
        return { donnees: mockDashboard };
      }
      return request<TableauDeBord>('/rapports/tableau-de-bord');
    },

    getEffectifs: async (params?: { territoire_id?: string; periode?: string }): Promise<Enveloppe<RapportEffectifs>> => {
      if (USE_MOCK_DATA) {
        return { 
          donnees: {
            periode: '2024',
            territoires: [
              { territoire_id: 't1', territoire_nom: 'Douala Centre', effectif: 450 },
              { territoire_id: 't2', territoire_nom: 'Yaoundé I', effectif: 380 },
              { territoire_id: 't3', territoire_nom: 'Bafoussam', effectif: 290 },
            ],
            total_general: 1120,
          }
        };
      }
      const qs = buildQueryString(params as Record<string, string | undefined>);
      return request<RapportEffectifs>(`/rapports/effectifs${qs}`);
    },

    getDemographie: async (params?: { territoire_id?: string }): Promise<Enveloppe<RapportDemographie>> => {
      const qs = buildQueryString(params as Record<string, string | undefined>);
      return request<RapportDemographie>(`/rapports/demographie${qs}`);
    },

    getMouvements: async (params?: { annee?: number }): Promise<Enveloppe<RapportMouvements>> => {
      if (USE_MOCK_DATA) {
        return {
          donnees: {
            annee: 2024,
            mouvements: [
              { mois: 'Jan', entrees: 45, sorties: 12, transferts: 3 },
              { mois: 'Fev', entrees: 52, sorties: 8, transferts: 5 },
              { mois: 'Mar', entrees: 38, sorties: 15, transferts: 2 },
              { mois: 'Avr', entrees: 61, sorties: 10, transferts: 4 },
              { mois: 'Mai', entrees: 49, sorties: 7, transferts: 3 },
              { mois: 'Jun', entrees: 55, sorties: 11, transferts: 6 },
            ],
          }
        };
      }
      const qs = buildQueryString(params as Record<string, number | undefined>);
      return request<RapportMouvements>(`/rapports/mouvements${qs}`);
    },

    getServiteurs: async (params?: { territoire_id?: string }): Promise<Enveloppe<RapportServiteurs>> => {
      const qs = buildQueryString(params as Record<string, string | undefined>);
      return request<RapportServiteurs>(`/rapports/serviteurs${qs}`);
    },

    export: async (rapportId: string, format: 'pdf' | 'xlsx' | 'csv'): Promise<Blob> => {
      const token = getToken();
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/rapports/export?rapport=${rapportId}&format=${format}`, { headers });
      if (!response.ok) throw new NetworkError('Echec de l\'export');
      return response.blob();
    },
  },

  // --- Journal d'audit ---
  journal: {
    list: async (params?: { page?: number; par_page?: number; action?: string; debut?: string; fin?: string }): Promise<Enveloppe<EntreeJournal[]>> => {
      if (USE_MOCK_DATA) {
        return { 
          donnees: mockJournal,
          meta: { total: mockJournal.length, page: 1, par_page: params?.par_page || 10 }
        };
      }
      const qs = buildQueryString(params as Record<string, string | number | undefined>);
      return request<EntreeJournal[]>(`/journal${qs}`);
    },

    getActions: async (params?: { debut?: string; fin?: string }): Promise<Enveloppe<JournalParAction[]>> => {
      if (USE_MOCK_DATA) {
        return {
          donnees: [
            { action: 'CREATE_PERSONNE', nombre: 15 },
            { action: 'UPDATE_PERSONNE', nombre: 28 },
            { action: 'LOGIN', nombre: 142 },
            { action: 'VALIDER_TRANSFERT', nombre: 8 },
          ]
        };
      }
      const qs = buildQueryString(params as Record<string, string | undefined>);
      return request<JournalParAction[]>(`/journal/actions${qs}`);
    },

    getConsultations: async (params?: { debut?: string; fin?: string }): Promise<Enveloppe<JournalConsultations[]>> => {
      if (USE_MOCK_DATA) {
        return { donnees: [] };
      }
      const qs = buildQueryString(params as Record<string, string | undefined>);
      return request<JournalConsultations[]>(`/journal/consultations${qs}`);
    },
  },

  // --- Utilisateurs ---
  utilisateurs: {
    list: async (params?: { page?: number; par_page?: number; role?: string }): Promise<Enveloppe<Compte[]>> => {
      if (USE_MOCK_DATA) {
        return { 
          donnees: mockComptes,
          meta: { total: mockComptes.length, page: 1, par_page: 10 }
        };
      }
      const qs = buildQueryString(params as Record<string, string | number | undefined>);
      return request<Compte[]>(`/utilisateurs${qs}`);
    },

    get: async (id: string): Promise<Enveloppe<Compte>> => {
      if (USE_MOCK_DATA) {
        const user = mockComptes.find(u => u.id === id);
        if (!user) throw new ApiError({ code: 'RESSOURCE_INTROUVABLE', message: 'Utilisateur introuvable', requete_id: '' }, 404);
        return { donnees: user };
      }
      return request<Compte>(`/utilisateurs/${id}`);
    },

    create: async (data: EntreeCreationUtilisateur): Promise<Enveloppe<Compte>> => {
      if (USE_MOCK_DATA) {
        const newUser: Compte = {
          id: `u${Date.now()}`,
          email: data.email,
          nom_complet: data.nom_complet,
          role: data.role,
          territoire_id: data.territoire_id,
          territoire_nom: 'Douala Centre',
          actif: true,
          derniere_connexion: null,
          cree_le: new Date().toISOString(),
          modifie_le: new Date().toISOString(),
        };
        return { donnees: newUser };
      }
      return request<Compte>('/utilisateurs', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: string, data: EntreeModificationUtilisateur): Promise<Enveloppe<Compte>> => {
      if (USE_MOCK_DATA) {
        const user = mockComptes.find(u => u.id === id);
        if (!user) throw new ApiError({ code: 'RESSOURCE_INTROUVABLE', message: 'Utilisateur introuvable', requete_id: '' }, 404);
        return { donnees: { ...user, ...data, modifie_le: new Date().toISOString() } };
      }
      return request<Compte>(`/utilisateurs/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },

    archive: async (id: string): Promise<void> => {
      if (USE_MOCK_DATA) return;
      await request(`/utilisateurs/${id}`, { method: 'DELETE' });
    },

    resetPassword: async (id: string, motDePasse: string): Promise<void> => {
      await request(`/utilisateurs/${id}/mot-de-passe`, {
        method: 'PUT',
        body: JSON.stringify({ mot_de_passe: motDePasse }),
      });
    },

    getPermissions: async (id: string): Promise<Enveloppe<DossierPermissions>> => {
      return request<DossierPermissions>(`/utilisateurs/${id}/permissions`);
    },

    setPermission: async (id: string, code: string, accordee: boolean): Promise<void> => {
      await request(`/utilisateurs/${id}/permissions/${code}`, {
        method: 'PUT',
        body: JSON.stringify({ accordee }),
      });
    },

    deletePermission: async (id: string, code: string): Promise<void> => {
      await request(`/utilisateurs/${id}/permissions/${code}`, { method: 'DELETE' });
    },
  },

  // --- Permissions ---
  permissions: {
    list: async (): Promise<Enveloppe<PermissionCatalogue[]>> => {
      return request<PermissionCatalogue[]>('/permissions');
    },
  },

  // --- Imports ---
  imports: {
    importPersonnes: async (file: File, territoireId: string, simulation: boolean = true): Promise<Enveloppe<RapportImport>> => {
      const formData = new FormData();
      formData.append('fichier', file);
      formData.append('territoire_id', territoireId);
      formData.append('simulation', String(simulation));

      const token = getToken();
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/imports/personnes`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.erreur, response.status);
      }
      return response.json();
    },

    getTemplate: async (): Promise<Blob> => {
      const token = getToken();
      const headers: HeadersInit = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/imports/personnes/modele`, { headers });
      if (!response.ok) throw new NetworkError('Echec du telechargement du modele');
      return response.blob();
    },
  },
};

// Re-export types for convenience
export type { Enveloppe, Meta };
export { getToken, clearTokens };
