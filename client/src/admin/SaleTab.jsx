import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Loading from '../components/Loading';

const emptyForm = { product: '', quantity: '1', sellingPrice: '', customerName: '', notes: '' };

export default function SaleTab() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    Promise.all([api.get('/products/admin'), api.get('/sales')])
      .then(([productsRes, salesRes]) => {
        setProducts(productsRes.data);
        setSales(salesRes.data);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const selectedProduct = products.find((p) => p._id === form.product);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleProductChange(id) {
    const product = products.find((p) => p._id === id);
    setForm((f) => ({ ...f, product: id, sellingPrice: product ? String(product.price) : f.sellingPrice }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/sales', {
        ...form,
        quantity: Number(form.quantity),
        sellingPrice: Number(form.sellingPrice),
      });
      toast.success('Sale recorded, stock updated');
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record sale');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="text-lg font-semibold text-navy-800 mb-3">New Sale Entry</h2>
        <form onSubmit={handleSubmit} className="bg-white border border-navy-100 rounded-xl p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Accessory</label>
            <select required value={form.product} onChange={(e) => handleProductChange(e.target.value)}
              className="w-full border border-navy-200 rounded-md px-3 py-2">
              <option value="">Select accessory...</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>{p.name} (in stock: {p.stock})</option>
              ))}
            </select>
            {selectedProduct && (
              <p className="text-xs text-navy-400 mt-1">Available stock: {selectedProduct.stock}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Quantity Sold</label>
              <input required type="number" min="1" max={selectedProduct?.stock || undefined}
                value={form.quantity} onChange={(e) => update('quantity', e.target.value)}
                className="w-full border border-navy-200 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Selling Price / Unit (₹)</label>
              <input required type="number" min="0" value={form.sellingPrice} onChange={(e) => update('sellingPrice', e.target.value)}
                className="w-full border border-navy-200 rounded-md px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Customer Name (optional)</label>
            <input value={form.customerName} onChange={(e) => update('customerName', e.target.value)}
              className="w-full border border-navy-200 rounded-md px-3 py-2" placeholder="Walk-in customer" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Notes (optional)</label>
            <textarea rows={2} value={form.notes} onChange={(e) => update('notes', e.target.value)}
              className="w-full border border-navy-200 rounded-md px-3 py-2" />
          </div>
          <button type="submit" disabled={saving || !selectedProduct || selectedProduct.stock <= 0}
            className="w-full bg-gold-400 text-navy-900 font-bold py-2.5 rounded-md hover:bg-gold-300 disabled:opacity-50">
            {saving ? 'Saving...' : 'Record Sale & Update Stock'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-navy-800 mb-3">Recent Sales</h2>
        {/* Desktop table */}
        <div className="hidden md:block bg-white border border-navy-100 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-navy-50 text-navy-500 text-left">
              <tr>
                <th className="p-3">Accessory</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Price</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {sales.map((s) => (
                <tr key={s._id}>
                  <td className="p-3 font-medium text-navy-900">{s.product?.name || '—'}</td>
                  <td className="p-3 text-navy-700">{s.quantity}</td>
                  <td className="p-3 text-navy-700">₹{s.sellingPrice}</td>
                  <td className="p-3 text-navy-500">{s.customerName || '—'}</td>
                  <td className="p-3 text-navy-400 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-navy-400">No sale entries yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card layout */}
        <div className="md:hidden space-y-3">
          {sales.map((s) => (
            <div key={s._id} className="bg-white border border-navy-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-navy-900 truncate">{s.product?.name || '—'}</p>
                <span className="text-xs text-navy-400">{new Date(s.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-navy-400 text-xs">Qty</span>
                  <p className="font-medium text-navy-700">{s.quantity}</p>
                </div>
                <div>
                  <span className="text-navy-400 text-xs">Price</span>
                  <p className="font-medium text-navy-700">₹{s.sellingPrice}</p>
                </div>
                <div>
                  <span className="text-navy-400 text-xs">Customer</span>
                  <p className="font-medium text-navy-700 truncate">{s.customerName || '—'}</p>
                </div>
              </div>
            </div>
          ))}
          {sales.length === 0 && (
            <p className="text-navy-400 text-center py-8">No sale entries yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
