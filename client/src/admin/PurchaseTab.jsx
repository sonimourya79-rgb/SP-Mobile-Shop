import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Loading from '../components/Loading';

const emptyForm = { product: '', quantity: '', costPrice: '', supplier: '', notes: '' };

export default function PurchaseTab() {
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    Promise.all([api.get('/products/admin'), api.get('/purchases')])
      .then(([productsRes, purchasesRes]) => {
        setProducts(productsRes.data);
        setPurchases(purchasesRes.data);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/purchases', {
        ...form,
        quantity: Number(form.quantity),
        costPrice: Number(form.costPrice) || 0,
      });
      toast.success('Purchase recorded, stock updated');
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record purchase');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="text-lg font-semibold text-navy-800 mb-3">New Purchase Entry</h2>
        <form onSubmit={handleSubmit} className="bg-white border border-navy-100 rounded-xl p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Accessory</label>
            <select required value={form.product} onChange={(e) => update('product', e.target.value)}
              className="w-full border border-navy-200 rounded-md px-3 py-2">
              <option value="">Select accessory...</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>{p.name} (current stock: {p.stock})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Quantity Purchased</label>
              <input required type="number" min="1" value={form.quantity} onChange={(e) => update('quantity', e.target.value)}
                className="w-full border border-navy-200 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Cost Price / Unit (₹)</label>
              <input type="number" min="0" value={form.costPrice} onChange={(e) => update('costPrice', e.target.value)}
                className="w-full border border-navy-200 rounded-md px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Supplier (optional)</label>
            <input value={form.supplier} onChange={(e) => update('supplier', e.target.value)}
              className="w-full border border-navy-200 rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Notes (optional)</label>
            <textarea rows={2} value={form.notes} onChange={(e) => update('notes', e.target.value)}
              className="w-full border border-navy-200 rounded-md px-3 py-2" />
          </div>
          <button type="submit" disabled={saving}
            className="w-full bg-navy-800 text-white font-semibold py-2.5 rounded-md hover:bg-navy-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Add Purchase & Update Stock'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-navy-800 mb-3">Recent Purchases</h2>
        {/* Desktop table */}
        <div className="hidden md:block bg-white border border-navy-100 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-navy-50 text-navy-500 text-left">
              <tr>
                <th className="p-3">Accessory</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Cost</th>
                <th className="p-3">Supplier</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {purchases.map((p) => (
                <tr key={p._id}>
                  <td className="p-3 font-medium text-navy-900">{p.product?.name || '—'}</td>
                  <td className="p-3 text-navy-700">{p.quantity}</td>
                  <td className="p-3 text-navy-700">₹{p.costPrice}</td>
                  <td className="p-3 text-navy-500">{p.supplier || '—'}</td>
                  <td className="p-3 text-navy-400 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {purchases.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-navy-400">No purchase entries yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card layout */}
        <div className="md:hidden space-y-3">
          {purchases.map((p) => (
            <div key={p._id} className="bg-white border border-navy-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-navy-900 truncate">{p.product?.name || '—'}</p>
                <span className="text-xs text-navy-400">{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-navy-400 text-xs">Qty</span>
                  <p className="font-medium text-navy-700">{p.quantity}</p>
                </div>
                <div>
                  <span className="text-navy-400 text-xs">Cost</span>
                  <p className="font-medium text-navy-700">₹{p.costPrice}</p>
                </div>
                <div>
                  <span className="text-navy-400 text-xs">Supplier</span>
                  <p className="font-medium text-navy-700 truncate">{p.supplier || '—'}</p>
                </div>
              </div>
            </div>
          ))}
          {purchases.length === 0 && (
            <p className="text-navy-400 text-center py-8">No purchase entries yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
