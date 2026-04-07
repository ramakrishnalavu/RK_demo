import { useEffect, useState } from 'react';
import { AdminLayout } from './AdminDashboard';
import { fetchShows, createShow, updateShow, deleteShow, fetchMovies, fetchTheaters } from '../../api/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Plus, Pencil, Trash2, Calendar, X, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { movieId: '', theaterId: '', showDate: '', showTime: '', ticketPrice: '' };

export default function AdminShows() {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [sRes, mRes, tRes] = await Promise.all([fetchShows({}), fetchMovies({}), fetchTheaters()]);
      setShows(sRes.data); setMovies(mRes.data); setTheaters(tRes.data);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (s) => {
    setEditing(s);
    setForm({ movieId: s.movieId, theaterId: s.theaterId, showDate: s.showDate, showTime: s.showTime, ticketPrice: s.ticketPrice });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, movieId: parseInt(form.movieId), theaterId: parseInt(form.theaterId), ticketPrice: parseFloat(form.ticketPrice) };
      if (editing) { await updateShow(editing.id, payload); toast.success('Show updated!'); }
      else { await createShow(payload); toast.success('Show scheduled!'); }
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.error || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this show?')) return;
    try { await deleteShow(id); toast.success('Show deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">Shows</h1>
            <p className="text-gray-500">{shows.length} shows scheduled</p>
          </div>
          <button id="add-show-btn" onClick={openAdd} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Schedule Show
          </button>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="space-y-3">
            {shows.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500">No shows scheduled yet</p>
              </div>
            ) : shows.map(s => (
              <div key={s.id} className="glass-card p-5 hover:border-indigo-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">{s.movieTitle}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{s.theaterName}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{s.showDate}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{s.showTime}</span>
                    <span className="badge bg-green-500/20 text-green-400 border border-green-500/30">{s.availableSeats} seats</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-white">₹{s.ticketPrice}</span>
                  <button onClick={() => openEdit(s)} className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 transition-all"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editing ? 'Edit Show' : 'Schedule Show'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="label">Movie *</label>
                <select value={form.movieId} onChange={e => setForm({ ...form, movieId: e.target.value })} required className="input-field">
                  <option value="">Select Movie</option>
                  {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Theater *</label>
                <select value={form.theaterId} onChange={e => setForm({ ...form, theaterId: e.target.value })} required className="input-field">
                  <option value="">Select Theater</option>
                  {theaters.map(t => <option key={t.id} value={t.id}>{t.name} — {t.location}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Date *</label>
                  <input type="date" value={form.showDate} onChange={e => setForm({ ...form, showDate: e.target.value })} required className="input-field" />
                </div>
                <div>
                  <label className="label">Time *</label>
                  <input type="time" value={form.showTime} onChange={e => setForm({ ...form, showTime: e.target.value })} required className="input-field" />
                </div>
              </div>
              <div>
                <label className="label">Ticket Price (₹) *</label>
                <input type="number" value={form.ticketPrice} onChange={e => setForm({ ...form, ticketPrice: e.target.value })} required min="0" className="input-field" placeholder="250" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 btn-outline">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
