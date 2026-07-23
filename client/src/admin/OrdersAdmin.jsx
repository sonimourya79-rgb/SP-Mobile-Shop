import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';

const STATUSES = ['pending', 'confirmed', 'ready', 'completed', 'cancelled'];

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [drafts, setDrafts] = useState({});

  function load() {
    setLoading(true);
    api.get('/orders', { params: filter ? { status: filter } : {} }).then((res) => {
      setOrders(res.data);
      const d = {};
      res.data.forEach((o) => {
        d[o._id] = { status: o.status, notes: o.notes || '' };
      });
      setDrafts(d);
    }).finally(() => setLoading(false));
  }

  useEffect(load, [filter]);

  function updateDraft(id, field, value) {
    setDrafts((d) => ({ ...d, [id]: { ...d[id], [field]: value } }));
  }

  async function save(id) {
    try {
      await api.put(`/orders/${id}/status`, drafts[id]);
      toast.success('Order updated');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-navy-900">Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="border border-navy-200 rounded-md px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <Loading />
      ) : orders.length === 0 ? (
        <p className="text-navy-400 text-center py-16">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="bg-white border border-navy-100 rounded-xl p-5 shadow-sm">
              <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                <div>
                  <p className="font-semibold text-navy-900">{o.customerName} · {o.phone}</p>
                  <p className="text-sm text-navy-500">{o.user?.email}</p>
                  {o.address && <p className="text-sm text-navy-500 mt-1">Address: {o.address}</p>}
                  <p className="text-xs text-navy-300 mt-1">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>

              <div className="divide-y divide-navy-50 mb-3">
                {o.items.map((item) => (
                  <div key={item.itemId} className="flex justify-between py-1.5 text-sm">
                    <span className="text-navy-700">{item.name} × {item.qty} ({item.itemType})</span>
                    <span className="font-medium text-navy-900">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
              <p className="text-right font-bold text-navy-900 mb-3">Total: ₹{o.totalAmount}</p>

              <div className="grid gap-3 sm:grid-cols-3 items-end">
                <div>
                  <label className="block text-xs font-medium text-navy-500 mb-1">Status</label>
                  <select value={drafts[o._id]?.status} onChange={(e) => updateDraft(o._id, 'status', e.target.value)}
                    className="w-full border border-navy-200 rounded-md px-3 py-2 text-sm">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-navy-500 mb-1">Notes</label>
                  <input value={drafts[o._id]?.notes} onChange={(e) => updateDraft(o._id, 'notes', e.target.value)}
                    className="w-full border border-navy-200 rounded-md px-3 py-2 text-sm" />
                </div>
              </div>
              <button onClick={() => save(o._id)}
                className="mt-3 w-full sm:w-auto bg-navy-800 text-white font-semibold px-4 py-2 rounded-md hover:bg-navy-700 text-sm">
                Save
              </button>
              {drafts[o._id]?.status === 'confirmed' && o.status !== 'confirmed' && o.status !== 'ready' && o.status !== 'completed' && (
                <p className="text-xs text-gold-600 mt-2">
                  Confirming will deduct accessory stock and mark any secondhand phones in this order as sold.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
