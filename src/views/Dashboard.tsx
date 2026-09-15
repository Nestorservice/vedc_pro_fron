import { useState, useEffect } from 'react';
import { Users, Shield, MapPin, ArrowRightLeft, TrendingUp, UserPlus } from 'lucide-react';
import { Card, Skeleton } from '../components/ui';
import { api } from '../services/api';
import type { DashboardData } from '../services/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard.get().then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading || !data) return <DashboardSkeleton />;

  const COLORS = ['#3B82F6', '#8B5CF6'];

  const stats = [
    { label: 'Total Membres', value: data.total_membres.toLocaleString(), icon: Users, color: 'bg-blue-50 text-blue-600', trend: '+12.4%' },
    { label: 'Serviteurs', value: data.total_serviteurs.toLocaleString(), icon: Shield, color: 'bg-indigo-50 text-indigo-600', trend: '+5.2%' },
    { label: 'Territoires', value: data.total_territoires.toString(), icon: MapPin, color: 'bg-emerald-50 text-emerald-600', trend: '+3' },
    { label: 'Transferts en attente', value: data.transferts_en_attente.toString(), icon: ArrowRightLeft, color: 'bg-amber-50 text-amber-600', trend: null },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
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
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data.mouvements_mensuels}>
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
        </Card>

        {/* Gender Distribution */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Repartition par Sexe</h3>
          <p className="text-xs text-slate-500 mb-4">Distribution des membres</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={data.repartition_sexe} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="valeur" strokeWidth={0}>
                {data.repartition_sexe.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {data.repartition_sexe.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs text-slate-600">{item.nom}: {item.valeur.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Effectifs par territoire */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Effectifs par Territoire</h3>
          <p className="text-xs text-slate-500 mb-4">Top 6 des districts</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.effectifs_par_territoire} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis type="category" dataKey="territoire" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} width={100} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
              <Bar dataKey="effectif" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Activities */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Activites Recentes</h3>
          <p className="text-xs text-slate-500 mb-4">Dernieres actions du systeme</p>
          <div className="space-y-3">
            {data.activites_recentes.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all duration-200">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  {activity.action.includes('membre') ? <UserPlus size={14} className="text-blue-500" /> :
                   activity.action.includes('Transfert') ? <ArrowRightLeft size={14} className="text-amber-500" /> :
                   <Users size={14} className="text-slate-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{activity.action}</p>
                  <p className="text-xs text-slate-500">{activity.utilisateur}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">
                  {new Date(activity.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
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
