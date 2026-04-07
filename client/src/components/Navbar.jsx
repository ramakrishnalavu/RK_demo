import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { Film, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-indigo-500/40 transition-all">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">CineBook</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`nav-link text-sm ${isActive('/') ? 'text-indigo-400' : ''}`}>Movies</Link>
            {isAuthenticated && (
              <Link to="/profile" className={`nav-link text-sm ${isActive('/profile') ? 'text-indigo-400' : ''}`}>My Bookings</Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className={`nav-link text-sm flex items-center gap-1 ${isActive('/admin') ? 'text-indigo-400' : ''}`}>
                <LayoutDashboard className="w-4 h-4" /> Admin
              </Link>
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                  <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-300 font-medium">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-outline text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden text-gray-400" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-2 animate-fade-in">
            <Link to="/" className="block px-3 py-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Movies</Link>
            {isAuthenticated && (
              <Link to="/profile" className="block px-3 py-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>My Bookings</Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="block px-3 py-2 text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Admin</Link>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-400 hover:text-red-300">Logout</button>
            ) : (
              <div className="flex gap-2 px-3">
                <Link to="/login" className="btn-outline text-sm py-2 px-4" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
