import { useState, useEffect } from 'react';
import { ArrowRightLeft, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, Badge, Button, Skeleton, EmptyState } from '../components/ui';
import { api, ApiError, CorsError, NetworkError } from '../services/api';
import type { Transfert, StatutTransfert } from '../services/types';
import { useToast } from '../components/ui/Toast';

export function Transfers() {
  const [transferts, setTransferts] = useState<Transfert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const { addToast } = useToast();

  useEffect(() => { loadTransferts(); }, []);

  const loadTransferts = async () => {
    setLoading(true); setError(null);
    try {
      const result = await api.transferts.list({ statut: filter !== 'all' ? filter : undefined });
      setTransferts(result.donnees);
    } catch (err) {
      if (err instanceof CorsError) { setError('CORS: connexion restreintee.'); addToast('warning', 'CORS', err.message); }
      else if (err instanceof NetworkError) { setError('Serveur inaccessible.'); addToast('error', 'Reseau', err.message); }
      else if (err instanceof ApiError) { setError(err.message); addToast('error', 'API', err.message); }
    } finally { setLoading(false); }
  };

  const handleValidate = async (id: string) => {
    try { await api.transferts.validate(id); addToast('success', 'Transfert valide'); loadTransferts(); }
    catch (err) { if (err instanceof ApiError) addToast('error', 'Erreur', err.message); }
  };

  const handleReject = async (id: string) => {
    try { await api.transferts.reject(id); addToast('info', 'Transfert rejete'); loadTransferts(); }
    catch (err) { if (err instanceof ApiError) addToast('error', 'Erreur', err.message); }
  };

  const statusConfig: Record<string, { variant: 'success' | 'warning' | 'danger' | 'info'; icon: typeof CheckCircle; label: string }> = {
    valide: { variant: 'success', icon: CheckCircle, label: 'Valide' },
    en_attente: { variant: 'warning', icon: Clock, label: 'En attente' },
    rejete: { variant: 'danger', icon: XCircle, label: 'Rejete' },
    annule: { variant: 'info', icon: AlertCircle, label: 'Annule' },
  };

  if (loading) return <div className="space-y-6"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <Card key={i}><Skeleton className="h-16 w-full" /></Card>)}</div><Card><Skeleton className="h-64 w-full" /></Card></div>;

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="border-b-2 border-black pb-6">
        <h1 className="text-4xl font-black uppercase tracking-tight">Transferts</h1>
        <p className="text-sm font-bold uppercase tracking-wider text-gray-600 mt-2">Suivi des demandes de transfert entre territoires</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-lg">
          <AlertCircle size={16} className="text-red-500 shrink-0" /><p className="text-sm text-red-700 flex-1">{error}</p>
          <button onClick={loadTransferts} className="text-xs font-medium text-red-600 hover:text-red-800 underline">Reessayer</button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {[{ key: 'all', label: 'Tous' }, { key: 'en_attente', label: 'En attente' }, { key: 'valide', label: 'Valides' }, { key: 'rejete', label: 'Rejetes' }].map(tab => (
          <button key={tab.key} onClick={() => { setFilter(tab.key); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filter === tab.key ? 'bg-[#0F172A] text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {transferts.length === 0 ? (
          <Card><EmptyState title="Aucun transfert" description="Aucun transfert ne correspond a ce filtre." icon={<ArrowRightLeft size={24} />} /></Card>
        ) : (
          transferts.map(t => {
            const config = statusConfig[t.statut] || statusConfig.en_attente;
            const Icon = config.icon;
            return (
              <Card key={t.id} className="hover:shadow-md transition-all duration-200">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.statut === 'valide' ? 'bg-emerald-50' : t.statut === 'en_attente' ? 'bg-amber-50' : t.statut === 'rejete' ? 'bg-red-50' : 'bg-slate-100'}`}>
                      <Icon size={18} className={t.statut === 'valide' ? 'text-emerald-600' : t.statut === 'en_attente' ? 'text-amber-600' : t.statut === 'rejete' ? 'text-red-600' : 'text-slate-500'} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{t.personne_nom} {t.personne_prenom}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Demande le {t.date_demande.slice(0, 10)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="text-right"><p className="text-xs text-slate-500">De</p><p className="text-sm font-medium text-slate-700">{t.territoire_origine_nom}</p></div>
                    <ArrowRightLeft size={16} className="text-slate-400 shrink-0" />
                    <div className="text-right"><p className="text-xs text-slate-500">Vers</p><p className="text-sm font-medium text-slate-700">{t.territoire_destination_nom}</p></div>
                  </div>
                  <div className="flex items-center gap-3 md:ml-auto">
                    <Badge variant={config.variant}>{config.label}</Badge>
                    {t.statut === 'en_attente' && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="secondary" onClick={() => handleValidate(t.id)} className="!px-2 !py-1.5 text-emerald-600 hover:bg-emerald-50"><CheckCircle size={14} /></Button>
                        <Button size="sm" variant="secondary" onClick={() => handleReject(t.id)} className="!px-2 !py-1.5 text-red-600 hover:bg-red-50"><XCircle size={14} /></Button>
                      </div>
                    )}
                  </div>
                </div>
                {t.motif && <div className="mt-3 pt-3 border-t border-slate-100"><p className="text-xs text-slate-500">Motif: <span className="text-slate-700">{t.motif}</span></p></div>}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
