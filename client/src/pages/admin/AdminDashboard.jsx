import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchDashboardStats } from '../../api/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  LayoutDashboard, Film, Calendar, Building2, Ticket,
  TrendingUp, Users, IndianRupee, CheckSquare
} from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/movies', label: 'Movies', icon: Film },
  { to: '/admin/shows', label: 'Shows', icon: Calendar },
  { to: '/admin/theaters', label: 'Theaters', icon: Building2 },
  { to: '/admin/bookings', label: 'Bookings', icon: Ticket },
];

export function AdminLayout({ children }) {
  const location = useLocation();
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-black/40 border-r border-white/10 hidden md:block">
        <div className="p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Admin Panel</h2>
          <nav className="space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === to
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      {/* Content */}
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><LoadingSpinner message="Loading dashboard..." /></AdminLayout>;

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, color: 'blue' },
    { label: 'Total Movies', value: stats?.totalMovies ?? 0, icon: Film, color: 'purple' },
    { label: 'Total Theaters', value: stats?.totalTheaters ?? 0, icon: Building2, color: 'cyan' },
    { label: 'Total Bookings', value: stats?.totalBookings ?? 0, icon: Ticket, color: 'amber' },
    { label: 'Confirmed', value: stats?.confirmedBookings ?? 0, icon: CheckSquare, color: 'green' },
    { label: 'Revenue', value: `₹${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: IndianRupee, color: 'emerald' },
  ];

  const colorMap = {
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    cyan: 'bg-cyan-500/20 text-cyan-400',
    amber: 'bg-amber-500/20 text-amber-400',
    green: 'bg-green-500/20 text-green-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
  };

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="section-title">Dashboard</h1>
          <p className="text-gray-500">Overview of your cinema platform</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {cards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="stat-card">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <p className="text-2xl font-black text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Nav */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {navItems.slice(1).map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}
                className="glass-card p-5 flex flex-col items-center gap-3 hover:border-indigo-500/40 transition-all group text-center">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center group-hover:bg-indigo-600/40 transition-all">
                  <Icon className="w-6 h-6 text-indigo-400" />
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">Manage {label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
