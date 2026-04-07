import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSeats, toggleSeat, clearSelectedSeats } from '../redux/slices/seatSlice';
import { setCurrentBooking } from '../redux/slices/bookingSlice';
import { fetchSeatsByShow, fetchShowById, createBooking } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { MapPin, Film, ChevronRight, Minus, Plus, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { seats, selectedSeats } = useSelector(s => s.seats);
  const { isAuthenticated } = useSelector(s => s.auth);
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    dispatch(clearSelectedSeats());
    const load = async () => {
      setLoading(true);
      try {
        const [showRes, seatsRes] = await Promise.all([
          fetchShowById(showId),
          fetchSeatsByShow(showId),
        ]);
        setShow(showRes.data);
        dispatch(setSeats(seatsRes.data));
      } catch {
        toast.error('Failed to load seat information');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => dispatch(clearSelectedSeats());
  }, [showId]);

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;
    dispatch(toggleSeat(seat.seatNumber));
  };

  const handleProceed = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }
    setBooking(true);
    try {
      const res = await createBooking({ showId: parseInt(showId), seatNumbers: selectedSeats });
      dispatch(setCurrentBooking(res.data));
      toast.success('Booking confirmed!');
      navigate('/booking-confirmation');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading seats..." />;

  // Group seats by row — guard ensures seats is always an array
  const seatList = Array.isArray(seats) ? seats : [];
  const seatsByRow = seatList.reduce((acc, seat) => {
    const row = seat.seatNumber[0];
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  const totalAmount = selectedSeats.length * (show?.ticketPrice || 0);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        {show && (
          <div className="glass-card p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white mb-1">{show.movieTitle}</h1>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{show.theaterName} • {show.theaterLocation}</span>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {new Date(show.showDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                {' • '}{show.showTime}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Ticket Price</p>
              <p className="text-2xl font-bold text-white">₹{show.ticketPrice}</p>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-t-lg bg-gray-700 border border-transparent"></div>
            <span className="text-sm text-gray-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-t-lg bg-indigo-600"></div>
            <span className="text-sm text-gray-400">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-t-lg bg-gray-800 opacity-50"></div>
            <span className="text-sm text-gray-400">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-t-lg bg-amber-900/60 border border-amber-700/40"></div>
            <span className="text-sm text-gray-400">VIP</span>
          </div>
        </div>

        {/* Screen */}
        <div className="relative mb-10">
          <div className="h-2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full opacity-60 mb-2" />
          <p className="text-center text-xs text-gray-500 tracking-[0.4em] uppercase">SCREEN</p>
        </div>

        {/* Seat Grid */}
        <div className="glass-card p-6 mb-8 overflow-x-auto">
          <div className="space-y-3 min-w-max mx-auto">
            {Object.keys(seatsByRow).sort().map(row => (
              <div key={row} className="flex items-center gap-3">
                <span className="w-5 text-xs text-gray-600 font-medium text-right">{row}</span>
                <div className="flex gap-1.5">
                  {seatsByRow[row]
                    .sort((a, b) => parseInt(a.seatNumber.slice(1)) - parseInt(b.seatNumber.slice(1)))
                    .map(seat => {
                      const isSelected = selectedSeats.includes(seat.seatNumber);
                      const isVip = seat.seatType === 'VIP';
                      const isPremium = seat.seatType === 'PREMIUM';

                      let className;
                      if (seat.isBooked) className = 'seat-booked';
                      else if (isSelected) className = 'seat-selected';
                      else if (isVip) className = 'seat-vip';
                      else className = isPremium
                        ? 'w-9 h-9 rounded-t-lg bg-purple-900/60 hover:bg-purple-500 text-xs font-medium text-purple-400 hover:text-white cursor-pointer transition-all duration-200 hover:scale-110 flex items-center justify-center'
                        : 'seat-available';

                      return (
                        <button
                          key={seat.id}
                          className={className}
                          onClick={() => handleSeatClick(seat)}
                          title={`${seat.seatNumber} - ${seat.seatType}`}
                        >
                          {seat.seatNumber.slice(1)}
                        </button>
                      );
                    })}
                </div>
                <span className="w-5 text-xs text-gray-600 font-medium">{row}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Summary - Sticky */}
        {selectedSeats.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 py-4 px-4 animate-slide-up">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-gray-400 text-sm">{selectedSeats.length} seat(s) selected</p>
                <p className="text-white font-medium">
                  {selectedSeats.join(', ')}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="text-2xl font-black text-white">₹{totalAmount}</p>
                </div>
                <button
                  onClick={handleProceed}
                  disabled={booking}
                  className="btn-accent flex items-center gap-2 min-w-36"
                >
                  {booking ? 'Booking...' : 'Confirm Booking'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
