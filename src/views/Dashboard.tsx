import { useState, useEffect } from 'react';
import { Users, Shield, MapPin, ArrowRightLeft, TrendingUp, UserPlus, AlertCircle } from 'lucide-react';
import { Card, Skeleton } from '../components/ui';
import { api, ApiError, CorsError, NetworkError } from '../services/api';
import type { TableauDeBord, RapportMouvements, RepartitionGrade, EffectifParTerritoire, EntreeJournal } from '../services/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useToast } from '../components/ui/Toast';

interface DashboardState {
  stats: TableauDeBord | null;
  mouvements: RapportMouvements | null;
  repartition: RepartitionGrade[];
  effectifs: EffectifParTerritoire[];
  activites: EntreeJournal[];
}

export function Dashboard() {
  const [state, setState] = useState<DashboardState>({
    stats: null, mouvements: null, repartition: [], effectifs: [], activites: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, mouvementsRes, statsServ, effectifsRes, journalRes] = await Promise.all([
        api.rapports.getDashboard(),
        api.rapports.getMouvements(),
        api.serviteurs.getStats(),
        api.rapports.getEffectifs(),
        api.journal.list({ par_page: 5 }),
      ]);

      setState({
        stats: statsRes.donnees,
        mouvements: mouvementsRes.donnees,
        repartition: statsServ.donnees,
        effectifs: effectifsRes.donnees.territoires.slice(0, 6),
        activites: journalRes.donnees,
      });
    } catch (err) {
      let msg = 'Impossible de charger le tableau de bord.';
      if (err instanceof CorsError) {
        msg = 'Erreur CORS: Le serveur ne semble pas autoriser les requetes depuis ce domaine. Les donnees de demonstration sont affichees.';
        addToast('warning', 'Connexion au serveur restreintee', msg);
      } else if (err instanceof NetworkError) {
        msg = 'Impossible de se connecter au serveur. Verifiez votre connexion internet.';
        addToast('error', 'Erreur reseau', msg);
      } else if (err instanceof ApiError) {
        msg = err.message;
        addToast('error', 'Erreur API', msg);
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  if (error && !state.stats) {
    return (
      <div className="animate-fade-in">
        <Card>
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <AlertCircle size={24} className="text-red-500" />
            </div>
            <h3 className="text-base font-semibold text-slate-700 mb-2">Erreur de chargement</h3>
            <p className="text-sm text-slate-500 text-center max-w-md mb-4">{error}</p>
            <button onClick={loadDashboard} className="px-4 py-2 bg-[#0F172A] text-white text-sm font-medium rounded-lg hover:bg-[#1E293B] transition-all duration-200">
              Reessayer
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const stats = state.stats;
  const mouvements = state.mouvements?.mouvements || [];
  const COLORS = ['#3B82F6', '#8B5CF6'];

  const statCards = [
    { label: 'Total Membres', value: stats?.total_membres.toLocaleString() || '0', icon: Users, color: 'bg-blue-50 text-blue-600', trend: stats?.croissance_annuelle ? `+${stats.croissance_annuelle}%` : null },
    { label: 'Serviteurs', value: stats?.total_serviteurs.toLocaleString() || '0', icon: Shield, color: 'bg-indigo-50 text-indigo-600', trend: null },
    { label: 'Territoires', value: stats?.total_territoires.toString() || '0', icon: MapPin, color: 'bg-emerald-50 text-emerald-600', trend: null },
    { label: 'Transferts en attente', value: stats?.transferts_en_attente.toString() || '0', icon: ArrowRightLeft, color: 'bg-amber-50 text-amber-600', trend: null },
  ];

  const sexeData = state.repartition.length > 0
    ? [{ nom: 'Total', valeur: state.repartition.reduce((a, b) => a + b.nombre, 0) }]
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                  {stat.trend && (
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp size={12} className="text-emerald-500" />
                      <span className="text-xs font-medium text-emerald-600">{stat.trend}</span>
                    </div>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon size={20} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Movements Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Mouvements Mensuels</h3>
              <p className="text-xs text-slate-500 mt-0.5">Entrees et sorties sur 6 mois</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-xs text-slate-500">Entrees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="text-xs text-slate-500">Sorties</span>
              </div>
            </div>
          </div>
          {mouvements.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={mouvements.slice(-6)}>
                <defs>
                  <linearGradient id="colorEntrees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="entrees" stroke="#3B82F6" strokeWidth={2} fill="url(#colorEntrees)" />
                <Area type="monotone" dataKey="sorties" stroke="#CBD5E1" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-60 text-sm text-slate-400">Aucune donnee de mouvement disponible</div>
          )}
        </Card>

        {/* Grade Distribution */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Serviteurs par Grade</h3>
          <p className="text-xs text-slate-500 mb-4">Repartition des grades</p>
          {state.repartition.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={state.repartition} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="nombre" strokeWidth={0} nameKey="grade">
                    {state.repartition.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {state.repartition.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-[10px] text-slate-600">{item.grade}: {item.nombre}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-sm text-slate-400">Aucune donnee</div>
          )}
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Effectifs */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Effectifs par Territoire</h3>
          <p className="text-xs text-slate-500 mb-4">Top districts</p>
          {state.effectifs.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={state.effectifs} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis type="category" dataKey="territoire_nom" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} width={100} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                <Bar dataKey="effectif" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-56 text-sm text-slate-400">Aucune donnee d'effectif</div>
          )}
        </Card>

        {/* Recent Activities */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Activites Recentes</h3>
          <p className="text-xs text-slate-500 mb-4">Dernieres actions du systeme</p>
          <div className="space-y-3">
            {state.activites.length > 0 ? state.activites.map((activity, i) => (
              <div key={activity.id || i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-200">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  {activity.action.includes('CREATE') ? <UserPlus size={14} className="text-blue-500" /> :
                   activity.action.includes('TRANSFERT') ? <ArrowRightLeft size={14} className="text-amber-500" /> :
                   <Users size={14} className="text-slate-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{activity.action}</p>
                  <p className="text-xs text-slate-500">{activity.utilisateur_nom}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">
                  {new Date(activity.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )) : (
              <p className="text-sm text-slate-400 py-4 text-center">Aucune activite recente</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-16" />
              </div>
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2"><Skeleton className="h-64 w-full" /></Card>
        <Card><Skeleton className="h-64 w-full" /></Card>
      </div>
    </div>
  );
}
