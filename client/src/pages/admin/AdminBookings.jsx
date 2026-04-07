import { useEffect, useState } from 'react';
import { AdminLayout } from './AdminDashboard';
import { fetchAllBookings } from '../../api/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Ticket, Film, MapPin, Calendar, Clock, User, CheckCircle, XCircle, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchAllBookings()
      .then(res => setBookings(res.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.paymentStatus === filter);

  const getStatusBadge = (status) => {
    const map = {
      COMPLETED: 'bg-green-500/20 text-green-400 border-green-500/30',
      CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
      PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };
    return <span className={`badge border ${map[status] || map.PENDING}`}>{status}</span>;
  };

  const totalRevenue = bookings.filter(b => b.paymentStatus === 'COMPLETED').reduce((s, b) => s + b.totalAmount, 0);

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="section-title">All Bookings</h1>
            <p className="text-gray-500">{bookings.length} total • Revenue: ₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['ALL', 'COMPLETED', 'CANCELLED', 'PENDING'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
              }`}>
              {f} {f === 'ALL' ? `(${bookings.length})` : `(${bookings.filter(b => b.paymentStatus === f).length})`}
            </button>
          ))}
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="glass-card p-10 text-center">
                <Ticket className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500">No bookings found</p>
              </div>
            ) : filtered.map(b => (
              <div key={b.id} className="glass-card p-4 hover:border-indigo-500/20 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Film className="w-4 h-4 text-indigo-400" />
                      <span className="font-semibold text-white">{b.movieTitle}</span>
                      <span className="text-xs text-gray-600">#{b.id}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{b.userName}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{b.theaterName}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.showDate}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.showTime}</span>
                      <span className="flex items-center gap-1"><Ticket className="w-3 h-3" />{b.seatNumbers?.join(', ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {getStatusBadge(b.paymentStatus)}
                    <span className="font-bold text-white">₹{b.totalAmount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
