import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';

const STATUSES = ['new', 'read', 'replied'];

export default function ContactMessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  function load() {
    setLoading(true);
    api.get('/contact', { params: filter ? { status: filter } : {} }).then((res) => setMessages(res.data)).finally(() => setLoading(false));
  }

  useEffect(load, [filter]);

  async function updateStatus(id, status) {
    try {
      await api.put(`/contact/${id}/status`, { status });
      toast.success('Updated');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-navy-900">Contact Messages</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="border border-navy-200 rounded-md px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <Loading />
      ) : messages.length === 0 ? (
        <p className="text-navy-400 text-center py-16">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m._id} className="bg-white border border-navy-100 rounded-xl p-5 shadow-sm">
              <div className="flex flex-wrap justify-between items-start gap-3 mb-2">
                <div>
                  <p className="font-semibold text-navy-900">{m.subject}</p>
                  <p className="text-sm text-navy-500">{m.name} · {m.email}{m.phone ? ` · ${m.phone}` : ''}</p>
                  <p className="text-xs text-navy-300 mt-1">{new Date(m.createdAt).toLocaleString()}</p>
                </div>
                <StatusBadge status={m.status} />
              </div>
              <p className="text-sm text-navy-700 whitespace-pre-line mb-3">{m.message}</p>
              <div className="flex gap-2">
                {STATUSES.filter((s) => s !== m.status).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(m._id, s)}
                    className="text-xs border border-navy-200 rounded-md px-3 py-1.5 hover:bg-navy-50 capitalize"
                  >
                    Mark {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
