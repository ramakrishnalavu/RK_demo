import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';
import { registerUser } from '../api/api';
import { Film, Mail, Lock, User, Eye, EyeOff, ArrowRight, Shield, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'USER' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await registerUser({ name: form.name, email: form.email, password: form.password, role: form.role });
      dispatch(loginSuccess(res.data));
      toast.success(`Welcome to CineBook, ${res.data.name}!`);
      navigate(res.data.role === 'ADMIN' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <Film className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join CineBook and start booking</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Role Selector */}
            <div>
              <label className="label">Account Type</label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'USER' })}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all font-medium text-sm ${
                    form.role === 'USER'
                      ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'ADMIN' })}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all font-medium text-sm ${
                    form.role === 'ADMIN'
                      ? 'border-purple-500 bg-purple-600/20 text-purple-300'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </button>
              </div>
              {form.role === 'ADMIN' && (
                <p className="text-xs text-purple-400 mt-2 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Admin accounts can manage movies, shows & theaters
                </p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="register-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="input-field pl-11"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="register-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="input-field pl-11"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="register-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="input-field pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="register-confirm-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Repeat your password"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                form.role === 'ADMIN'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25'
                  : 'btn-primary'
              }`}
            >
              {loading ? 'Creating Account...' : `Create ${form.role === 'ADMIN' ? 'Admin' : 'Customer'} Account`}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
