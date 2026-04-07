import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMovies, setFilters, clearFilters, setLoading } from '../redux/slices/movieSlice';
import { fetchMovies } from '../api/api';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, SlidersHorizontal, Film, X, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Sci-Fi', 'Animation'];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada'];
const YEARS = [2024, 2023, 2022, 2021, 2020, 2019];

export default function Home() {
  const dispatch = useDispatch();
  const { list: movies, filters, loading } = useSelector(s => s.movies);
  const [searchInput, setSearchInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const loadMovies = async () => {
    dispatch(setLoading(true));
    try {
      const params = {};
      if (filters.genre) params.genre = filters.genre;
      if (filters.language) params.language = filters.language;
      if (filters.releaseYear) params.releaseYear = filters.releaseYear;
      if (filters.search) params.search = filters.search;
      const res = await fetchMovies(params);
      dispatch(setMovies(res.data));
    } catch {
      toast.error('Failed to load movies');
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => { loadMovies(); }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchInput }));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: filters[key] === value ? '' : value }));
  };

  const handleClear = () => {
    dispatch(clearFilters());
    setSearchInput('');
  };

  const hasActiveFilters = filters.genre || filters.language || filters.releaseYear || filters.search;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-hero-gradient py-20 px-4">
        <div className="absolute inset-0 opacity-30"
             style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #4f46e5 0%, transparent 60%), radial-gradient(circle at 70% 50%, #7c3aed 0%, transparent 60%)' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Film className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-gray-300">Book your movie experience</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
            Cinema at Your<br />
            <span className="text-gradient">Fingertips</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            Discover the latest movies, pick your perfect seats, and enjoy a seamless booking experience.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search for a movie..."
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 transition-all"
              />
            </div>
            <button type="submit" className="btn-primary px-6">Search</button>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${sidebarOpen ? 'w-64 flex-shrink-0' : 'hidden'} hidden md:block`}>
            <div className="glass-card p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-semibold text-white">Filters</h3>
                </div>
                {hasActiveFilters && (
                  <button onClick={handleClear} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              {/* Genre */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Genre</h4>
                <div className="space-y-1.5">
                  {GENRES.map(g => (
                    <button
                      key={g}
                      onClick={() => handleFilterChange('genre', g)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        filters.genre === g
                          ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Language</h4>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(l => (
                    <button
                      key={l}
                      onClick={() => handleFilterChange('language', l)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        filters.language === l
                          ? 'bg-purple-600/40 text-purple-300 border border-purple-500/50'
                          : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Release Year</h4>
                <div className="space-y-1.5">
                  {YEARS.map(y => (
                    <button
                      key={y}
                      onClick={() => handleFilterChange('releaseYear', y)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        filters.releaseYear == y
                          ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Movie Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-title text-2xl">
                  {hasActiveFilters ? 'Filtered Results' : 'Now Showing'}
                </h2>
                <p className="text-gray-500 text-sm">{movies.length} movies found</p>
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden flex items-center gap-2 btn-outline text-sm py-2"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
            </div>

            {loading ? (
              <LoadingSpinner message="Fetching movies..." />
            ) : movies.length === 0 ? (
              <div className="text-center py-20">
                <Film className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No movies found</p>
                <p className="text-gray-600 text-sm mb-6">Try adjusting your filters or add movies via the Admin panel</p>
                {hasActiveFilters && (
                  <button onClick={handleClear} className="btn-outline text-sm">Clear Filters</button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-fade-in">
                {movies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
