import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { resolveImage } from '../../api/config';
import AccountTabs from '../../components/AccountTabs';
import StatusBadge from '../../components/StatusBadge';
import Loading from '../../components/Loading';

export default function MyPrintCovers() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/print-covers/mine').then((res) => setRequests(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-navy-900 mb-4">My Account</h1>
      <AccountTabs />

      {loading ? (
        <Loading />
      ) : requests.length === 0 ? (
        <p className="text-navy-400 text-center py-16">No print cover requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div key={r._id} className="bg-white border border-navy-100 rounded-xl p-5 shadow-sm flex gap-4">
              <img
                src={resolveImage(r.photo)}
                alt="Print cover"
                className="h-20 w-20 object-cover rounded-lg border border-navy-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                  <span className="font-semibold text-navy-900">{r.deviceBrand} {r.deviceModel}</span>
                  <StatusBadge status={r.status} />
                </div>
                {r.price > 0 && <p className="text-sm text-navy-600">Price: ₹{r.price}</p>}
                {r.adminNotes && <p className="text-sm text-navy-400 italic mt-1">Shop notes: {r.adminNotes}</p>}
                <p className="text-xs text-navy-300 mt-2">{new Date(r.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
