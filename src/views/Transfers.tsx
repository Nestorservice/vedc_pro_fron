import { useState, useEffect } from 'react';
import { ArrowRightLeft, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, Badge, Button, Skeleton, EmptyState } from '../components/ui';
import { api } from '../services/api';
import type { Transfert } from '../services/mockData';

export function Transfers() {
  const [transferts, setTransferts] = useState<Transfert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    api.transferts.list().then(d => { setTransferts(d); setLoading(false); });
  }, []);

  const filtered = filter === 'all' ? transferts : transferts.filter(t => t.statut === filter);

  const statusConfig: Record<string, { variant: 'success' | 'warning' | 'danger' | 'info'; icon: typeof CheckCircle; label: string }> = {
    valide: { variant: 'success', icon: CheckCircle, label: 'Valide' },
    en_attente: { variant: 'warning', icon: Clock, label: 'En attente' },
    rejete: { variant: 'danger', icon: XCircle, label: 'Rejete' },
    annule: { variant: 'info', icon: AlertCircle, label: 'Annule' },
  };

  const counts = {
    all: transferts.length,
    en_attente: transferts.filter(t => t.statut === 'en_attente').length,
    valide: transferts.filter(t => t.statut === 'valide').length,
    rejete: transferts.filter(t => t.statut === 'rejete').length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Card key={i}><Skeleton className="h-16 w-full" /></Card>)}
        </div>
        <Card><Skeleton className="h-64 w-full" /></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">Gestion des Transferts</h3>
        <p className="text-sm text-slate-500 mt-0.5">Suivi des demandes de transfert entre territoires</p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'Tous' },
          { key: 'en_attente', label: 'En attente' },
          { key: 'valide', label: 'Valides' },
          { key: 'rejete', label: 'Rejetes' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === tab.key ? 'bg-[#0F172A] text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
            <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${filter === tab.key ? 'bg-white/20' : 'bg-slate-100'}`}>
              {counts[tab.key as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {/* Transfer Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <EmptyState title="Aucun transfert" description="Aucun transfert ne correspond a ce filtre." icon={<ArrowRightLeft size={24} />} />
          </Card>
        ) : (
          filtered.map(t => {
            const config = statusConfig[t.statut];
            const Icon = config.icon;
            return (
              <Card key={t.id} className="hover:shadow-md transition-all duration-200">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      t.statut === 'valide' ? 'bg-emerald-50' : t.statut === 'en_attente' ? 'bg-amber-50' : t.statut === 'rejete' ? 'bg-red-50' : 'bg-slate-100'
                    }`}>
                      <Icon size={18} className={
                        t.statut === 'valide' ? 'text-emerald-600' : t.statut === 'en_attente' ? 'text-amber-600' : t.statut === 'rejete' ? 'text-red-600' : 'text-slate-500'
                      } />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{t.personne_nom}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Demande le {new Date(t.date_demande).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">De</p>
                      <p className="text-sm font-medium text-slate-700">{t.territoire_origine}</p>
                    </div>
                    <ArrowRightLeft size={16} className="text-slate-400 shrink-0" />
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Vers</p>
                      <p className="text-sm font-medium text-slate-700">{t.territoire_destination}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:ml-auto">
                    <Badge variant={config.variant}>{config.label}</Badge>
                    {t.statut === 'en_attente' && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="secondary" className="!px-2 !py-1.5 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200">
                          <CheckCircle size={14} />
                        </Button>
                        <Button size="sm" variant="secondary" className="!px-2 !py-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200">
                          <XCircle size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                {t.motif && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500">Motif: <span className="text-slate-700">{t.motif}</span></p>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
