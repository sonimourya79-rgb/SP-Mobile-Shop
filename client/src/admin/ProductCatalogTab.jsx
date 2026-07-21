import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { resolveImage } from '../api/config';
import Loading from '../components/Loading';

const CATEGORIES = [
  'Tempered Glass',
  'Back Cover',
  'Charger',
  'Charging Cable',
  'Power Bank',
  'Battery',
  'Wired Earphones',
  'Neckband Bluetooth',
  'Bluetooth Earbuds',
  'Bluetooth Speaker',
  'Mobile Holder',
  'OTG & Adapters',
  'Other',
];

const emptyForm = { name: '', description: '', category: CATEGORIES[0], price: '', stock: '', isActive: true };

export default function ProductCatalogTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, object = edit
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api.get('/products/admin').then((res) => setProducts(res.data)).finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openNew() {
    setForm(emptyForm);
    setFiles([]);
    setEditing({});
  }

  function openEdit(p) {
    setForm({
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      stock: p.stock,
      isActive: p.isActive,
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
        await api.put(`/products/${editing._id}`, data);
        toast.success('Product updated');
      } else {
        await api.post('/products', data);
        toast.success('Product created');
      }
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${p._id}`);
      toast.success('Product deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  }

  async function removeImage(p, img) {
    try {
      const data = new FormData();
      data.append('removeImages', img);
      const res = await api.put(`/products/${p._id}`, data);
      toast.success('Image removed');
      setEditing(res.data);
      load();
    } catch (err) {
      toast.error('Failed to remove image');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <button onClick={openNew} className="bg-navy-800 text-white font-semibold px-4 py-2 rounded-md hover:bg-navy-700">
          + Add Accessory
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="bg-white rounded-xl border border-navy-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-navy-50 text-navy-500 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Active</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="p-3 font-medium text-navy-900">{p.name}</td>
                  <td className="p-3 text-navy-500">{p.category}</td>
                  <td className="p-3 text-navy-700">₹{p.price}</td>
                  <td className={`p-3 ${p.stock <= 5 ? 'text-red-500 font-semibold' : 'text-navy-700'}`}>{p.stock}</td>
                  <td className="p-3">{p.isActive ? 'Yes' : 'No'}</td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={() => openEdit(p)} className="text-navy-700 hover:text-navy-900 font-medium">Edit</button>
                    <button onClick={() => handleDelete(p)} className="text-red-500 hover:text-red-600 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-navy-400">No accessories yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-navy-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-navy-900 mb-4">{editing._id ? 'Edit Accessory' : 'New Accessory'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Name</label>
                <input required value={form.name} onChange={(e) => update('name', e.target.value)}
                  className="w-full border border-navy-200 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => update('description', e.target.value)}
                  className="w-full border border-navy-200 rounded-md px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Category</label>
                  <select value={form.category} onChange={(e) => update('category', e.target.value)}
                    className="w-full border border-navy-200 rounded-md px-3 py-2">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Price (₹)</label>
                  <input required type="number" min="0" value={form.price} onChange={(e) => update('price', e.target.value)}
                    className="w-full border border-navy-200 rounded-md px-3 py-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Stock</label>
                  <input required type="number" min="0" value={form.stock} onChange={(e) => update('stock', e.target.value)}
                    className="w-full border border-navy-200 rounded-md px-3 py-2" />
                  <p className="text-xs text-navy-400 mt-1">Use the Purchase / Sale tabs to adjust stock day-to-day — this field is for the initial count.</p>
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
