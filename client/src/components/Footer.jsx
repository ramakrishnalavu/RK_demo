import { Film } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black/40 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">CineBook</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Your premier destination for booking movie tickets. Experience cinema like never before.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Movies</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-indigo-400 transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Help Center</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Privacy Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-600 text-sm">© 2024 CineBook. All rights reserved.</p>
          <p className="text-gray-600 text-sm mt-2 md:mt-0">Built with ❤️ for movie lovers</p>
        </div>
      </div>
    </footer>
  );
}
