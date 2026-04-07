import { useEffect, useState } from 'react';
import { AdminLayout } from './AdminDashboard';
import { fetchTheaters, createTheater, updateTheater, deleteTheater } from '../../api/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Plus, Pencil, Trash2, Building2, X, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { name: '', location: '', totalSeats: '' };

export default function AdminTheaters() {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const res = await fetchTheaters(); setTheaters(res.data); }
    catch { toast.error('Failed to load theaters'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (t) => { setEditing(t); setForm({ name: t.name, location: t.location, totalSeats: t.totalSeats }); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, totalSeats: parseInt(form.totalSeats) };
      if (editing) { await updateTheater(editing.id, payload); toast.success('Theater updated!'); }
      else { await createTheater(payload); toast.success('Theater added!'); }
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.error || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this theater?')) return;
    try { await deleteTheater(id); toast.success('Theater deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">Theaters</h1>
            <p className="text-gray-500">{theaters.length} theaters registered</p>
          </div>
          <button id="add-theater-btn" onClick={openAdd} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Theater
          </button>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {theaters.length === 0 ? (
              <div className="col-span-3 glass-card p-12 text-center">
                <Building2 className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500">No theaters yet. Add one to get started!</p>
              </div>
            ) : theaters.map(t => (
              <div key={t.id} className="glass-card p-5 hover:border-indigo-500/30 transition-all">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{t.name}</h3>
                    <div className="flex items-center gap-1 text-gray-400 text-sm mt-0.5">
                      <MapPin className="w-3.5 h-3.5" /><span>{t.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="badge bg-white/10 text-gray-400">{t.totalSeats} seats</span>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(t)} className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 transition-all"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(t.id)} className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
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
              <h2 className="text-xl font-bold text-white">{editing ? 'Edit Theater' : 'Add Theater'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="label">Theater Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="input-field" placeholder="INOX Cinemas" />
              </div>
              <div>
                <label className="label">Location *</label>
                <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required className="input-field" placeholder="Mumbai, Maharashtra" />
              </div>
              <div>
                <label className="label">Total Seats *</label>
                <input type="number" value={form.totalSeats} onChange={e => setForm({ ...form, totalSeats: e.target.value })} required min="1" className="input-field" placeholder="200" />
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
