import { mockDashboard, mockPersonnes, mockTerritoires, mockServiteurs, mockTransferts, mockUtilisateurs, mockJournal } from './mockData';
import type { DashboardData, Personne, Territoire, Serviteur, Transfert, Utilisateur, JournalEntry } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  dashboard: {
    get: async (): Promise<DashboardData> => {
      await delay(600);
      return { ...mockDashboard };
    },
  },
  personnes: {
    list: async (params?: { page?: number; search?: string }): Promise<{ data: Personne[]; total: number }> => {
      await delay(400);
      let filtered = [...mockPersonnes];
      if (params?.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter(p => p.nom.toLowerCase().includes(s) || p.prenom.toLowerCase().includes(s));
      }
      const page = params?.page || 1;
      const perPage = 8;
      const start = (page - 1) * perPage;
      return { data: filtered.slice(start, start + perPage), total: filtered.length };
    },
    get: async (id: string): Promise<Personne | undefined> => {
      await delay(300);
      return mockPersonnes.find(p => p.id === id);
    },
    create: async (data: Partial<Personne>): Promise<Personne> => {
      await delay(500);
      return { ...data, id: String(Date.now()), created_at: new Date().toISOString() } as Personne;
    },
  },
  territoires: {
    list: async (): Promise<Territoire[]> => {
      await delay(400);
      return [...mockTerritoires];
    },
    get: async (id: string): Promise<Territoire | undefined> => {
      await delay(300);
      return mockTerritoires.find(t => t.id === id);
    },
    create: async (data: Partial<Territoire>): Promise<Territoire> => {
      await delay(500);
      return { ...data, id: `t${Date.now()}`, actif: true, created_at: new Date().toISOString() } as Territoire;
    },
  },
  serviteurs: {
    list: async (): Promise<Serviteur[]> => {
      await delay(400);
      return [...mockServiteurs];
    },
    get: async (id: string): Promise<Serviteur | undefined> => {
      await delay(300);
      return mockServiteurs.find(s => s.id === id);
    },
    getStats: async (): Promise<{ grade: string; count: number }[]> => {
      await delay(400);
      return [
        { grade: 'Pasteur', count: 45 },
        { grade: 'Ancien', count: 120 },
        { grade: 'Diacre', count: 230 },
        { grade: 'Evangliste', count: 89 },
        { grade: 'Missionnaire', count: 67 },
        { grade: 'Monitor', count: 310 },
      ];
    },
  },
  transferts: {
    list: async (): Promise<Transfert[]> => {
      await delay(400);
      return [...mockTransferts];
    },
    get: async (id: string): Promise<Transfert | undefined> => {
      await delay(300);
      return mockTransferts.find(t => t.id === id);
    },
    getPendingCount: async (): Promise<number> => {
      await delay(200);
      return mockTransferts.filter(t => t.statut === 'en_attente').length;
    },
  },
  utilisateurs: {
    list: async (): Promise<Utilisateur[]> => {
      await delay(400);
      return [...mockUtilisateurs];
    },
    get: async (id: string): Promise<Utilisateur | undefined> => {
      await delay(300);
      return mockUtilisateurs.find(u => u.id === id);
    },
  },
  journal: {
    list: async (): Promise<JournalEntry[]> => {
      await delay(400);
      return [...mockJournal];
    },
    getActions: async (): Promise<{ action: string; count: number }[]> => {
      await delay(300);
      return [
        { action: 'CREATE_PERSONNE', count: 45 },
        { action: 'UPDATE_PERSONNE', count: 120 },
        { action: 'LOGIN', count: 890 },
        { action: 'VALIDER_TRANSFERT', count: 23 },
        { action: 'PROMOTION', count: 12 },
        { action: 'CREATE_TERRITOIRE', count: 5 },
      ];
    },
  },
  auth: {
    login: async (_email: string, _password: string): Promise<{ token: string; user: Utilisateur }> => {
      await delay(800);
      return { token: 'mock-jwt-token', user: mockUtilisateurs[0] };
    },
    getProfile: async (): Promise<Utilisateur> => {
      await delay(200);
      return mockUtilisateurs[0];
    },
  },
};
