import { Link } from 'react-router-dom';
import { Film, Star, Clock, Globe } from 'lucide-react';

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 
                      hover:border-indigo-500/40 transition-all duration-300 
                      hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10">
        {/* Poster */}
        <div className="relative overflow-hidden aspect-[2/3]">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
            />
          ) : null}
          {/* Fallback */}
          <div
            className="w-full h-full bg-gradient-to-br from-indigo-900/60 to-purple-900/60 
                       items-center justify-center"
            style={{ display: movie.posterUrl ? 'none' : 'flex' }}
          >
            <Film className="w-16 h-16 text-indigo-400/50" />
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                          flex items-end p-4">
            <span className="btn-accent text-xs py-2 px-4 w-full text-center">Book Tickets</span>
          </div>

          {/* Rating badge */}
          {movie.rating && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 
                            flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-white">{movie.rating}</span>
            </div>
          )}

          {/* Genre badge */}
          {movie.genre && (
            <div className="absolute top-3 left-3 bg-indigo-600/80 backdrop-blur-sm rounded-lg px-2 py-1">
              <span className="text-xs font-medium text-white">{movie.genre}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-bold text-white text-sm leading-tight mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {movie.durationMinutes && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {movie.durationMinutes}m
              </span>
            )}
            {movie.language && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" /> {movie.language}
              </span>
            )}
            {movie.releaseYear && (
              <span>{movie.releaseYear}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
