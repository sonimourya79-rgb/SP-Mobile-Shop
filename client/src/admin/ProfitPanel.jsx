import { useEffect, useState } from 'react';
import api from '../api/axios';
import Loading from '../components/Loading';

const GRANULARITIES = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
];

function formatPeriod(period, granularity) {
  const d = new Date(period);
  switch (granularity) {
    case 'day':
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    case 'week':
      return `Week of ${d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`;
    case 'year':
      return String(d.getFullYear());
    case 'month':
    default:
      return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  }
}

export default function ProfitPanel() {
  const [granularity, setGranularity] = useState('month');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get('/dashboard/profit', { params: { granularity } })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [granularity]);

  const maxRevenue = data ? Math.max(1, ...data.series.map((s) => s.revenue)) : 1;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h2 className="text-xl font-bold text-navy-900">Profit Overview</h2>
        <div className="flex gap-1 bg-navy-100 rounded-lg p-1">
          {GRANULARITIES.map((g) => (
            <button
              key={g.key}
              onClick={() => setGranularity(g.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                granularity === g.key ? 'bg-navy-800 text-white' : 'text-navy-600 hover:bg-navy-200'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {loading || !data ? (
        <Loading />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3 mb-4">
            <div className="bg-white border border-navy-100 rounded-xl p-5 shadow-sm">
              <p className="text-2xl font-bold text-navy-900">₹{data.totals.revenue.toLocaleString('en-IN')}</p>
              <p className="text-sm text-navy-500 mt-1">Total Revenue</p>
            </div>
            <div className="bg-white border border-navy-100 rounded-xl p-5 shadow-sm">
              <p className="text-2xl font-bold text-navy-900">₹{data.totals.cost.toLocaleString('en-IN')}</p>
              <p className="text-sm text-navy-500 mt-1">Cost of Stock Purchased</p>
            </div>
            <div className="bg-white border border-navy-100 rounded-xl p-5 shadow-sm">
              <p className={`text-2xl font-bold ${data.totals.profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                ₹{data.totals.profit.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-navy-500 mt-1">Net Profit</p>
            </div>
          </div>

          <p className="text-xs text-navy-400 mb-4">
            Revenue = in-store accessory sales (Sale Entry) + confirmed/completed online orders' accessory items.
            Cost = accessory stock purchases (Purchase Entry). Secondhand phone sales aren't included since their
            acquisition cost isn't separately tracked.
          </p>

          {data.series.length === 0 ? (
            <p className="text-navy-400 text-center py-12 bg-white border border-navy-100 rounded-xl">
              No purchase or sale entries in this range yet.
            </p>
          ) : (
            <div className="bg-white border border-navy-100 rounded-xl divide-y divide-navy-50 shadow-sm">
              {[...data.series].reverse().map((s) => (
                <div key={s.period} className="p-4">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-navy-800">{formatPeriod(s.period, data.granularity)}</span>
                    <span className={`font-semibold ${s.profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      ₹{s.profit.toLocaleString('en-IN')} profit
                    </span>
                  </div>
                  <div className="h-2 bg-navy-50 rounded-full overflow-hidden mb-1.5">
                    <div
                      className="h-full bg-gold-400 rounded-full"
                      style={{ width: `${Math.max(2, (s.revenue / maxRevenue) * 100)}%` }}
                    />
                  </div>
                  <div className="flex gap-4 text-xs text-navy-400">
                    <span>Revenue: ₹{s.revenue.toLocaleString('en-IN')}</span>
                    <span>Cost: ₹{s.cost.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
