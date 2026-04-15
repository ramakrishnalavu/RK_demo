// 
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

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ HANDLE REGISTER
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match ❌');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      };

      console.log("SENDING DATA:", payload); // DEBUG

      const res = await registerUser(payload);

      console.log("RESPONSE:", res.data); // DEBUG

      // ✅ Save token
      localStorage.setItem("movieToken", res.data.token);

      // ✅ Save in redux
      dispatch(loginSuccess(res.data));

      toast.success(`Welcome ${res.data.name} 🎉`);

      // ✅ Redirect
      navigate(res.data.role === 'ADMIN' ? '/admin' : '/');

    } catch (err) {
      console.log("ERROR:", err.response?.data);

      toast.error(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Film className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join CineBook and start booking</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Role */}
            <div>
              <label className="label">Account Type</label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'USER' })}
                  className={`p-3 rounded-xl border ${
                    form.role === 'USER'
                      ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                      : 'border-gray-600 text-gray-400'
                  }`}
                >
                  <Users className="inline w-4 h-4 mr-1" />
                  Customer
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'ADMIN' })}
                  className={`p-3 rounded-xl border ${
                    form.role === 'ADMIN'
                      ? 'border-purple-500 bg-purple-600/20 text-purple-300'
                      : 'border-gray-600 text-gray-400'
                  }`}
                >
                  <Shield className="inline w-4 h-4 mr-1" />
                  Admin
                </button>

              </div>
            </div>

            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Confirm Password"
              required
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="input-field"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

          </form>

          <div className="mt-6 text-center">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-400">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}