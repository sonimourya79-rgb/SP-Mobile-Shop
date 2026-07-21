import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';

const STATUSES = ['received', 'diagnosing', 'in-progress', 'completed', 'delivered', 'cancelled'];

export default function RepairsAdmin() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [drafts, setDrafts] = useState({});

  function load() {
    setLoading(true);
    api.get('/repairs', { params: filter ? { status: filter } : {} }).then((res) => {
      setRepairs(res.data);
      const d = {};
      res.data.forEach((r) => {
        d[r._id] = { status: r.status, estimatedCost: r.estimatedCost || 0, adminNotes: r.adminNotes || '' };
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
      await api.put(`/repairs/${id}/status`, drafts[id]);
      toast.success('Repair updated');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-navy-900">Repair Requests</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="border border-navy-200 rounded-md px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <Loading />
      ) : repairs.length === 0 ? (
        <p className="text-navy-400 text-center py-16">No repair requests found.</p>
      ) : (
        <div className="space-y-4">
          {repairs.map((r) => (
            <div key={r._id} className="bg-white border border-navy-100 rounded-xl p-5 shadow-sm">
              <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                <div>
                  <p className="font-semibold text-navy-900">{r.deviceBrand} {r.deviceModel}</p>
                  <p className="text-sm text-navy-500">{r.name} · {r.phone}{r.email ? ` · ${r.email}` : ''}</p>
                  <p className="text-sm text-navy-600 mt-1">Issue: {r.issueType}{r.issueDescription ? ` — ${r.issueDescription}` : ''}</p>
                  <p className="text-xs text-navy-300 mt-1">{new Date(r.createdAt).toLocaleString()}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <div className="grid gap-3 sm:grid-cols-3 items-end">
                <div>
                  <label className="block text-xs font-medium text-navy-500 mb-1">Status</label>
                  <select value={drafts[r._id]?.status} onChange={(e) => updateDraft(r._id, 'status', e.target.value)}
                    className="w-full border border-navy-200 rounded-md px-3 py-2 text-sm">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-500 mb-1">Estimated Cost (₹)</label>
                  <input type="number" min="0" value={drafts[r._id]?.estimatedCost}
                    onChange={(e) => updateDraft(r._id, 'estimatedCost', e.target.value)}
                    className="w-full border border-navy-200 rounded-md px-3 py-2 text-sm" />
                </div>
                <button onClick={() => save(r._id)}
                  className="bg-navy-800 text-white font-semibold px-4 py-2 rounded-md hover:bg-navy-700 text-sm">
                  Save
                </button>
              </div>
              <div className="mt-3">
                <label className="block text-xs font-medium text-navy-500 mb-1">Admin Notes</label>
                <textarea rows={2} value={drafts[r._id]?.adminNotes}
                  onChange={(e) => updateDraft(r._id, 'adminNotes', e.target.value)}
                  className="w-full border border-navy-200 rounded-md px-3 py-2 text-sm" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
