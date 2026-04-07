import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchMyBookings, cancelBooking } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Ticket, MapPin, Calendar, XCircle, CheckCircle, Clock, Film } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useSelector(s => s.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchMyBookings();
      setBookings(res.data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(id);
    try {
      const res = await cancelBooking(id);
      setBookings(prev => prev.map(b => b.id === id ? res.data : b));
      toast.success('Booking cancelled successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cancellation failed');
    } finally {
      setCancelling(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Confirmed</span>;
      case 'CANCELLED':
        return <span className="badge bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="badge bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  const canCancel = (booking) => {
    if (booking.paymentStatus !== 'COMPLETED') return false;
    const showDateTime = new Date(`${booking.showDate}T${booking.showTime}`);
    const oneHourBefore = new Date(showDateTime.getTime() - 60 * 60 * 1000);
    return new Date() < oneHourBefore;
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="glass-card p-6 mb-8 flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
            <p className="text-gray-400">{user?.email}</p>
            <span className="badge bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 mt-1">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Bookings */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Ticket className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">My Bookings</h2>
            <span className="badge bg-white/10 text-gray-400 ml-1">{bookings.length}</span>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading bookings..." />
          ) : bookings.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Film className="w-14 h-14 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No bookings yet</p>
              <p className="text-gray-600 text-sm">Browse movies and book your first ticket!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings
                .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
                .map(booking => (
                <div key={booking.id} className="glass-card p-5 hover:border-indigo-500/20 transition-all">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Film className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg leading-tight">{booking.movieTitle}</h3>
                          <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{booking.theaterName} • {booking.theaterLocation}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(booking.showDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{booking.showTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Ticket className="w-3.5 h-3.5" />
                          <span>{booking.seatNumbers.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(booking.paymentStatus)}
                      <p className="text-xl font-bold text-white">₹{booking.totalAmount}</p>
                      <p className="text-xs text-gray-600">Booking #{booking.id}</p>
                      {canCancel(booking) && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancelling === booking.id}
                          className="btn-danger text-xs py-1.5 px-3"
                        >
                          {cancelling === booking.id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
