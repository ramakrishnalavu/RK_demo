import { useEffect, useState } from 'react';
import { AdminLayout } from './AdminDashboard';
import { fetchMovies, createMovie, updateMovie, deleteMovie } from '../../api/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Plus, Pencil, Trash2, Film, X, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { title: '', genre: '', language: '', releaseYear: '', posterUrl: '', description: '', cast: '', rating: '', durationMinutes: '' };

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const res = await fetchMovies({}); setMovies(res.data); }
    catch { toast.error('Failed to load movies'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (m) => {
    setEditing(m);
    setForm({ ...m, releaseYear: m.releaseYear || '', rating: m.rating || '', durationMinutes: m.durationMinutes || '' });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, releaseYear: parseInt(form.releaseYear) || null, rating: parseFloat(form.rating) || null, durationMinutes: parseInt(form.durationMinutes) || null };
      if (editing) {
        await updateMovie(editing.id, payload);
        toast.success('Movie updated!');
      } else {
        await createMovie(payload);
        toast.success('Movie added!');
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this movie?')) return;
    try { await deleteMovie(id); toast.success('Movie deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">Movies</h1>
            <p className="text-gray-500">{movies.length} movies in your library</p>
          </div>
          <button id="add-movie-btn" onClick={openAdd} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Movie
          </button>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {movies.map(m => (
              <div key={m.id} className="glass-card p-4 hover:border-indigo-500/30 transition-all group">
                <div className="relative overflow-hidden rounded-xl mb-3 aspect-[2/3] bg-white/5">
                  {m.posterUrl ? (
                    <img src={m.posterUrl} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-12 h-12 text-gray-700" />
                    </div>
                  )}
                  {m.rating && (
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-white">{m.rating}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">{m.title}</h3>
                <p className="text-xs text-gray-500 mb-3">{m.genre} • {m.language} • {m.releaseYear}</p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(m)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 text-xs transition-all">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/40 text-xs transition-all">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editing ? 'Edit Movie' : 'Add Movie'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              {[['title', 'Title *'], ['genre', 'Genre'], ['language', 'Language'], ['posterUrl', 'Poster URL']].map(([key, label]) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <input type="text" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    required={key === 'title'} className="input-field" placeholder={label} />
                </div>
              ))}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">Year</label>
                  <input type="number" value={form.releaseYear} onChange={e => setForm({ ...form, releaseYear: e.target.value })} className="input-field" placeholder="2024" />
                </div>
                <div>
                  <label className="label">Rating</label>
                  <input type="number" step="0.1" max="10" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} className="input-field" placeholder="8.5" />
                </div>
                <div>
                  <label className="label">Duration (min)</label>
                  <input type="number" value={form.durationMinutes} onChange={e => setForm({ ...form, durationMinutes: e.target.value })} className="input-field" placeholder="150" />
                </div>
              </div>
              <div>
                <label className="label">Cast</label>
                <input type="text" value={form.cast} onChange={e => setForm({ ...form, cast: e.target.value })} className="input-field" placeholder="Actor 1, Actor 2..." />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3} className="input-field resize-none" placeholder="Movie description..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 btn-outline">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary">{saving ? 'Saving...' : 'Save Movie'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
