import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { resolveImage } from '../api/config';
import Loading from '../components/Loading';

const CONDITIONS = ['Excellent', 'Good', 'Fair'];
const STATUSES = ['available', 'sold'];

const emptyForm = {
  brand: '', model: '', condition: CONDITIONS[1], storage: '', color: '',
  price: '', description: '', status: 'available', isActive: true,
};

export default function SecondhandAdmin() {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api.get('/secondhand/admin').then((res) => setPhones(res.data)).finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openNew() {
    setForm(emptyForm);
    setFiles([]);
    setEditing({});
  }

  function openEdit(p) {
    setForm({
      brand: p.brand, model: p.model, condition: p.condition, storage: p.storage, color: p.color,
      price: p.price, description: p.description, status: p.status, isActive: p.isActive,
    });
    setFiles([]);
    setEditing(p);
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      files.forEach((f) => data.append('images', f));

      if (editing._id) {
        await api.put(`/secondhand/${editing._id}`, data);
        toast.success('Listing updated');
      } else {
        await api.post('/secondhand', data);
        toast.success('Listing created');
      }
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save listing');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p) {
    if (!confirm(`Delete "${p.brand} ${p.model}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/secondhand/${p._id}`);
      toast.success('Listing deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  }

  async function removeImage(p, img) {
    try {
      const data = new FormData();
      data.append('removeImages', img);
      const res = await api.put(`/secondhand/${p._id}`, data);
      toast.success('Image removed');
      setEditing(res.data);
      load();
    } catch (err) {
      toast.error('Failed to remove image');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Secondhand Phones</h1>
        <button onClick={openNew} className="bg-navy-800 text-white font-semibold px-4 py-2 rounded-md hover:bg-navy-700">
          + Add Phone
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : phones.length === 0 ? (
        <p className="text-navy-400 text-center py-16">No secondhand phones yet.</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-navy-100 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-navy-50 text-navy-500 text-left">
                <tr>
                  <th className="p-3">Image</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Condition</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Active</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {phones.map((p) => (
                  <tr key={p._id}>
                    <td className="p-3">
                      {p.images?.length > 0 ? (
                        <img src={resolveImage(p.images[0])} alt="" className="h-10 w-10 object-cover rounded-md" />
                      ) : (
                        <span className="text-navy-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="p-3 font-medium text-navy-900">{p.brand} {p.model}</td>
                    <td className="p-3 text-navy-500">{p.condition}</td>
                    <td className="p-3 text-navy-700">₹{p.price}</td>
                    <td className={`p-3 capitalize ${p.status === 'sold' ? 'text-red-500' : 'text-green-600'} font-medium`}>{p.status}</td>
                    <td className="p-3">{p.isActive ? 'Yes' : 'No'}</td>
                    <td className="p-3 text-right space-x-2">
                      <button onClick={() => openEdit(p)} className="text-navy-700 hover:text-navy-900 font-medium">Edit</button>
                      <button onClick={() => handleDelete(p)} className="text-red-500 hover:text-red-600 font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card layout */}
          <div className="md:hidden space-y-3">
            {phones.map((p) => (
              <div key={p._id} className="bg-white border border-navy-100 rounded-xl p-4 shadow-sm">
                <div className="flex gap-3">
                  {p.images?.length > 0 && (
                    <img src={resolveImage(p.images[0])} alt="" className="h-16 w-16 object-cover rounded-lg shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-navy-900 truncate">{p.brand} {p.model}</p>
                    <p className="text-xs text-navy-500">{p.condition} · {p.storage || '—'} · {p.color || '—'}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-sm">
                      <span className="font-bold text-navy-800">₹{p.price}</span>
                      <span className={`capitalize font-medium ${p.status === 'sold' ? 'text-red-500' : 'text-green-600'}`}>
                        {p.status}
                      </span>
                      {p.isActive ? (
                        <span className="text-xs text-green-600">Active</span>
                      ) : (
                        <span className="text-xs text-navy-400">Inactive</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-navy-50">
                  <button onClick={() => openEdit(p)} className="flex-1 text-center border border-navy-200 rounded-md py-1.5 text-sm font-medium text-navy-700 hover:bg-navy-50">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p)} className="flex-1 text-center border border-red-200 rounded-md py-1.5 text-sm font-medium text-red-500 hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {editing && (
        <div className="fixed inset-0 bg-navy-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-navy-900 mb-4">{editing._id ? 'Edit Phone' : 'New Phone'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Brand</label>
                  <input required value={form.brand} onChange={(e) => update('brand', e.target.value)}
                    className="w-full border border-navy-200 rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Model</label>
                  <input required value={form.model} onChange={(e) => update('model', e.target.value)}
                    className="w-full border border-navy-200 rounded-md px-3 py-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Storage</label>
                  <input value={form.storage} onChange={(e) => update('storage', e.target.value)} placeholder="e.g. 128GB"
                    className="w-full border border-navy-200 rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Color</label>
                  <input value={form.color} onChange={(e) => update('color', e.target.value)}
                    className="w-full border border-navy-200 rounded-md px-3 py-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Condition</label>
                  <select value={form.condition} onChange={(e) => update('condition', e.target.value)}
                    className="w-full border border-navy-200 rounded-md px-3 py-2">
                    {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Price (₹)</label>
                  <input required type="number" min="0" value={form.price} onChange={(e) => update('price', e.target.value)}
                    className="w-full border border-navy-200 rounded-md px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => update('description', e.target.value)}
                  className="w-full border border-navy-200 rounded-md px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => update('status', e.target.value)}
                    className="w-full border border-navy-200 rounded-md px-3 py-2">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm text-navy-700">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => update('isActive', e.target.checked)} />
                    Active (visible to customers)
                  </label>
                </div>
              </div>

              {editing.images?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {editing.images.map((img) => (
                    <div key={img} className="relative h-16 w-16">
                      <img src={resolveImage(img)} alt="" className="h-full w-full object-cover rounded-md" />
                      <button type="button" onClick={() => removeImage(editing, img)}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full h-5 w-5 text-xs">×</button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Add Images</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files))}
                  className="w-full text-sm" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditing(null)}
                  className="flex-1 border border-navy-200 rounded-md py-2 font-medium text-navy-700 hover:bg-navy-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-navy-800 text-white rounded-md py-2 font-semibold hover:bg-navy-700 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
