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
        msg = 'Erreur CORS: Le serveur ne semble pas autoriser les requêtes depuis ce domaine.';
        addToast('warning', 'Connexion au serveur restreintée', msg);
      } else if (err instanceof NetworkError) {
        msg = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
        addToast('error', 'Erreur réseau', msg);
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
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-[#FEF2F2] flex items-center justify-center mb-4">
              <AlertCircle size={24} className="text-[#EF4444]" />
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Erreur de chargement</h3>
            <p className="text-sm text-[#64748B] text-center max-w-md mb-6">{error}</p>
            <button onClick={loadDashboard} className="px-6 py-3 bg-[#2563EB] text-white text-sm font-medium rounded-xl hover:bg-[#1D4ED8] transition-all duration-300 shadow-sm hover:shadow-md">
              Réessayer
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const stats = state.stats;
  const mouvements = state.mouvements?.mouvements || [];
  const COLORS = ['#2563EB', '#4F46E5', '#7C3AED', '#EC4899'];

  const statCards = [
    { label: 'Total Membres', value: stats?.total_membres.toLocaleString() || '0', icon: Users, color: 'bg-[#EFF6FF] text-[#2563EB]', trend: stats?.croissance_annuelle ? `+${stats.croissance_annuelle}%` : null },
    { label: 'Serviteurs', value: stats?.total_serviteurs.toLocaleString() || '0', icon: Shield, color: 'bg-[#F5F3FF] text-[#7C3AED]', trend: null },
    { label: 'Territoires', value: stats?.total_territoires.toString() || '0', icon: MapPin, color: 'bg-[#ECFDF5] text-[#10B981]', trend: null },
    { label: 'Transferts en attente', value: stats?.transferts_en_attente.toString() || '0', icon: ArrowRightLeft, color: 'bg-[#FFFBEB] text-[#F59E0B]', trend: null },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#64748B]">{stat.label}</p>
                  <p className="text-3xl font-semibold text-[#0F172A] mt-2">{stat.value}</p>
                  {stat.trend && (
                    <div className="flex items-center gap-1.5 mt-3">
                      <TrendingUp size={14} className="text-[#10B981]" />
                      <span className="text-sm font-medium text-[#10B981]">{stat.trend}</span>
                    </div>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon size={22} />
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
              <h3 className="text-lg font-semibold text-[#0F172A]">Mouvements Mensuels</h3>
              <p className="text-sm text-[#64748B] mt-1">Entrées et sorties sur 6 mois</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#2563EB]" />
                <span className="text-sm text-[#64748B]">Entrées</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#94A3B8]" />
                <span className="text-sm text-[#64748B]">Sorties</span>
              </div>
            </div>
          </div>
          {mouvements.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={mouvements.slice(-6)}>
                <defs>
                  <linearGradient id="colorEntrees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="entrees" stroke="#2563EB" strokeWidth={2} fill="url(#colorEntrees)" />
                <Area type="monotone" dataKey="sorties" stroke="#94A3B8" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-72 text-sm text-[#94A3B8]">Aucune donnée de mouvement disponible</div>
          )}
        </Card>

        {/* Grade Distribution */}
        <Card>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Serviteurs par Grade</h3>
          <p className="text-sm text-[#64748B] mb-6">Répartition des grades</p>
          {state.repartition.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={state.repartition} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="nombre" strokeWidth={0} nameKey="grade">
                    {state.repartition.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #F1F5F9' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {state.repartition.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-sm text-[#64748B]">{item.grade}: {item.nombre}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-56 text-sm text-[#94A3B8]">Aucune donnée</div>
          )}
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Effectifs */}
        <Card>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Effectifs par Territoire</h3>
          <p className="text-sm text-[#64748B] mb-6">Top districts</p>
          {state.effectifs.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={state.effectifs} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis type="category" dataKey="territoire_nom" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#0F172A' }} width={120} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #F1F5F9' }} />
                <Bar dataKey="effectif" fill="#2563EB" radius={[0, 8, 8, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-sm text-[#94A3B8]">Aucune donnée d'effectif</div>
          )}
        </Card>

        {/* Recent Activities */}
        <Card>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Activités Récentes</h3>
          <p className="text-sm text-[#64748B] mb-6">Dernières actions du système</p>
          <div className="space-y-3">
            {state.activites.length > 0 ? state.activites.map((activity, i) => (
              <div key={activity.id || i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F8FAFC] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center shrink-0">
                  {activity.action.includes('CREATE') ? <UserPlus size={16} className="text-[#2563EB]" /> :
                   activity.action.includes('TRANSFERT') ? <ArrowRightLeft size={16} className="text-[#F59E0B]" /> :
                   <Users size={16} className="text-[#64748B]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0F172A] truncate">{activity.action}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{activity.utilisateur_nom}</p>
                </div>
                <span className="text-xs text-[#94A3B8] shrink-0">
                  {new Date(activity.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )) : (
              <p className="text-sm text-[#94A3B8] py-8 text-center">Aucune activité récente</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
              <Skeleton className="h-12 w-12 rounded-xl" />
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
