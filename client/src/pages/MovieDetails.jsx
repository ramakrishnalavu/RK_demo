import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchMovieById, fetchShows } from '../api/api';
import { setSelectedShow } from '../redux/slices/bookingSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { Star, Clock, Globe, ChevronRight, Film, MapPin, Calendar, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [mRes, sRes] = await Promise.all([
          fetchMovieById(id),
          fetchShows({ movieId: id })
        ]);
        setMovie(mRes.data);
        setShows(sRes.data);
        if (sRes.data.length > 0) {
          const dates = [...new Set(sRes.data.map(s => s.showDate))];
          setSelectedDate(dates[0]);
        }
      } catch {
        toast.error('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const uniqueDates = [...new Set(shows.map(s => s.showDate))].sort();
  const filteredShows = shows.filter(s => !selectedDate || s.showDate === selectedDate);

  const handleBookShow = (show) => {
    dispatch(setSelectedShow(show));
    navigate(`/seat-selection/${show.id}`);
  };

  if (loading) return <LoadingSpinner message="Loading movie..." />;
  if (!movie) return <div className="text-center py-20 text-gray-400">Movie not found</div>;

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Hero Banner */}
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          {movie.posterUrl && (
            <img src={movie.posterUrl} alt="" className="w-full h-full object-cover blur-2xl opacity-20 scale-110" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="w-52 md:w-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                {movie.posterUrl ? (
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="aspect-[2/3] bg-gradient-to-br from-indigo-900/60 to-purple-900/60 flex items-center justify-center">
                    <Film className="w-16 h-16 text-indigo-400/50" />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 pt-4">
              {movie.genre && (
                <span className="badge bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 mb-3">
                  {movie.genre}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">{movie.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                {movie.rating && (
                  <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-amber-400">{movie.rating}/10</span>
                  </div>
                )}
                {movie.durationMinutes && (
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{movie.durationMinutes} min</span>
                  </div>
                )}
                {movie.language && (
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Globe className="w-4 h-4" />
                    <span>{movie.language}</span>
                  </div>
                )}
                {movie.releaseYear && (
                  <span className="text-gray-400">{movie.releaseYear}</span>
                )}
              </div>

              {movie.description && (
                <p className="text-gray-300 leading-relaxed mb-6 max-w-2xl">{movie.description}</p>
              )}

              {movie.cast && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Cast</h3>
                  <p className="text-gray-300 text-sm">{movie.cast}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Shows Section */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="section-title mb-2">Book Tickets</h2>
        <p className="section-subtitle">Select a date and show time to continue</p>

        {shows.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No shows scheduled for this movie yet.</p>
          </div>
        ) : (
          <>
            {/* Date Selector */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
              {uniqueDates.map(date => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 flex flex-col items-center px-5 py-3 rounded-xl border transition-all ${
                    selectedDate === date
                      ? 'bg-indigo-600/30 border-indigo-500 text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <Calendar className="w-4 h-4 mb-1" />
                  <span className="text-sm font-semibold">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span className="text-xs opacity-70">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                </button>
              ))}
            </div>

            {/* Show Cards */}
            <div className="space-y-4">
              {filteredShows.map(show => (
                <div key={show.id} className="glass-card p-5 hover:border-indigo-500/30 transition-all">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-white">{show.showTime}</span>
                        <span className="badge bg-green-500/20 text-green-400 border border-green-500/30">
                          {show.availableSeats} seats left
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{show.theaterName}</span>
                        <span className="text-gray-600">•</span>
                        <span>{show.theaterLocation}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Price per seat</p>
                        <p className="text-2xl font-bold text-white">₹{show.ticketPrice}</p>
                      </div>
                      <button
                        onClick={() => handleBookShow(show)}
                        disabled={show.availableSeats === 0}
                        className={`btn-accent flex items-center gap-2 ${show.availableSeats === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Select Seats <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
