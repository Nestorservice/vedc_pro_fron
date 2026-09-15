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
        msg = 'Erreur CORS: Le serveur ne semble pas autoriser les requetes depuis ce domaine.';
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
      <div className="animate-fade-in p-8">
        <Card>
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 border-2 border-red-600 flex items-center justify-center mb-6">
              <AlertCircle size={32} className="text-red-600" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-wide mb-3">Erreur de chargement</h3>
            <p className="text-sm text-gray-600 text-center max-w-md mb-6">{error}</p>
            <button onClick={loadDashboard} className="px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-wide border-2 border-black hover:bg-white hover:text-black transition-all duration-150">
              Reessayer
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const stats = state.stats;
  const mouvements = state.mouvements?.mouvements || [];
  const COLORS = ['#000000', '#4A5568', '#718096', '#A0AEC0'];

  const statCards = [
    { label: 'Total Membres', value: stats?.total_membres.toLocaleString() || '0', icon: Users, trend: stats?.croissance_annuelle ? `+${stats.croissance_annuelle}%` : null },
    { label: 'Serviteurs', value: stats?.total_serviteurs.toLocaleString() || '0', icon: Shield, trend: null },
    { label: 'Territoires', value: stats?.total_territoires.toString() || '0', icon: MapPin, trend: null },
    { label: 'Transferts en attente', value: stats?.transferts_en_attente.toString() || '0', icon: ArrowRightLeft, trend: null },
  ];

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Page Title */}
      <div className="border-b-2 border-black pb-6">
        <h1 className="text-4xl font-black uppercase tracking-tight">Tableau de Bord</h1>
        <p className="text-sm font-bold uppercase tracking-wider text-gray-600 mt-2">Vue d'ensemble du systeme</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="hover:border-gray-400 transition-all duration-150">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">{stat.label}</p>
                  <p className="text-4xl font-black">{stat.value}</p>
                  {stat.trend && (
                    <div className="flex items-center gap-2 mt-4">
                      <TrendingUp size={14} className="text-black" />
                      <span className="text-xs font-bold uppercase tracking-wide">{stat.trend}</span>
                    </div>
                  )}
                </div>
                <div className="w-12 h-12 border-2 border-black flex items-center justify-center">
                  <Icon size={24} />
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black uppercase tracking-wide">Mouvements Mensuels</h3>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mt-1">Entrees et sorties sur 6 mois</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-black" />
                <span className="text-xs font-bold uppercase tracking-wide">Entrees</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400" />
                <span className="text-xs font-bold uppercase tracking-wide">Sorties</span>
              </div>
            </div>
          </div>
          {mouvements.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={mouvements.slice(-6)}>
                <defs>
                  <linearGradient id="colorEntrees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="mois" axisLine={{ stroke: '#000000', strokeWidth: 2 }} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#000000' }} />
                <YAxis axisLine={{ stroke: '#000000', strokeWidth: 2 }} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#000000' }} />
                <Tooltip contentStyle={{ border: '2px solid #000000', borderRadius: 0 }} />
                <Area type="monotone" dataKey="entrees" stroke="#000000" strokeWidth={3} fill="url(#colorEntrees)" />
                <Area type="monotone" dataKey="sorties" stroke="#718096" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-72 text-sm font-bold uppercase tracking-wide text-gray-400">Aucune donnee de mouvement disponible</div>
          )}
        </Card>

        {/* Grade Distribution */}
        <Card>
          <h3 className="text-xl font-black uppercase tracking-wide mb-2">Serviteurs par Grade</h3>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-8">Repartition des grades</p>
          {state.repartition.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={state.repartition} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="nombre" strokeWidth={0} nameKey="grade">
                    {state.repartition.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ border: '2px solid #000000', borderRadius: 0 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {state.repartition.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs font-bold uppercase tracking-wide">{item.grade}: {item.nombre}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-56 text-sm font-bold uppercase tracking-wide text-gray-400">Aucune donnee</div>
          )}
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Effectifs */}
        <Card>
          <h3 className="text-xl font-black uppercase tracking-wide mb-2">Effectifs par Territoire</h3>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-8">Top districts</p>
          {state.effectifs.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={state.effectifs} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" axisLine={{ stroke: '#000000', strokeWidth: 2 }} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#000000' }} />
                <YAxis type="category" dataKey="territoire_nom" axisLine={{ stroke: '#000000', strokeWidth: 2 }} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#000000' }} width={120} />
                <Tooltip contentStyle={{ border: '2px solid #000000', borderRadius: 0 }} />
                <Bar dataKey="effectif" fill="#000000" barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-sm font-bold uppercase tracking-wide text-gray-400">Aucune donnee d'effectif</div>
          )}
        </Card>

        {/* Recent Activities */}
        <Card>
          <h3 className="text-xl font-black uppercase tracking-wide mb-2">Activites Recentes</h3>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-8">Dernieres actions du systeme</p>
          <div className="space-y-4">
            {state.activites.length > 0 ? state.activites.map((activity, i) => (
              <div key={activity.id || i} className="flex items-start gap-4 p-4 border-2 border-black hover:bg-gray-50 transition-all duration-150">
                <div className="w-10 h-10 border-2 border-black flex items-center justify-center shrink-0">
                  {activity.action.includes('CREATE') ? <UserPlus size={16} /> :
                   activity.action.includes('TRANSFERT') ? <ArrowRightLeft size={16} /> :
                   <Users size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold uppercase tracking-wide truncate">{activity.action}</p>
                  <p className="text-xs text-gray-600 mt-1">{activity.utilisateur_nom}</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-wide text-gray-600 shrink-0">
                  {new Date(activity.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )) : (
              <p className="text-sm font-bold uppercase tracking-wide text-gray-400 py-8 text-center">Aucune activite recente</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-8">
      <div className="border-b-2 border-black pb-6">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-20" />
              </div>
              <Skeleton className="h-12 w-12" />
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2"><Skeleton className="h-72 w-full" /></Card>
        <Card><Skeleton className="h-72 w-full" /></Card>
      </div>
    </div>
  );
}
