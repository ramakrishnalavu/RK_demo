import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Film, MapPin, Calendar, Ticket, Home, User } from 'lucide-react';
import { useEffect } from 'react';

export default function BookingConfirmation() {
  const { currentBooking } = useSelector(s => s.booking);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentBooking) navigate('/');
  }, [currentBooking]);

  if (!currentBooking) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full animate-slide-up">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Booking Confirmed!</h1>
          <p className="text-gray-400">Your tickets have been booked successfully</p>
        </div>

        {/* Ticket Card */}
        <div className="relative glass-card overflow-hidden">
          {/* Top decoration */}
          <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600" />

          <div className="p-6">
            {/* Movie */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
              <div className="w-14 h-14 bg-indigo-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Film className="w-7 h-7 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{currentBooking.movieTitle}</h2>
                <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{currentBooking.theaterName} • {currentBooking.theaterLocation}</span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</p>
                <p className="text-white font-semibold">
                  {new Date(currentBooking.showDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Time</p>
                <p className="text-white font-semibold">{currentBooking.showTime}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Seats</p>
                <div className="flex flex-wrap gap-1">
                  {currentBooking.seatNumbers.map(s => (
                    <span key={s} className="badge bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Booking ID</p>
                <p className="text-white font-semibold">#{currentBooking.id}</p>
              </div>
            </div>

            {/* Dashed Separator */}
            <div className="border-t border-dashed border-white/10 my-4 relative">
              <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-5 h-5 bg-black/90 rounded-full" />
              <div className="absolute -right-7 top-1/2 -translate-y-1/2 w-5 h-5 bg-black/90 rounded-full" />
            </div>

            {/* Total */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-amber-400" />
                <span className="text-gray-400">{currentBooking.seatNumbers.length} ticket(s)</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Total Paid</p>
                <p className="text-2xl font-black text-white">₹{currentBooking.totalAmount}</p>
              </div>
            </div>

            {/* Status */}
            <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-medium">Payment Successful</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Link to="/" className="flex-1 btn-outline flex items-center justify-center gap-2">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link to="/profile" className="flex-1 btn-primary flex items-center justify-center gap-2">
            <User className="w-4 h-4" /> My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
