import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Loading from '../components/Loading';
import ProfitPanel from './ProfitPanel';

const CARDS = [
  { key: 'pendingRepairs', label: 'New Repair Requests', to: '/admin/repairs' },
  { key: 'activeRepairs', label: 'Repairs In Progress', to: '/admin/repairs' },
  { key: 'pendingSellRequests', label: 'Pending Sell Requests', to: '/admin/sell-requests' },
  { key: 'pendingPrintCovers', label: 'Pending Print Cover Requests', to: '/admin/print-covers' },
  { key: 'pendingOrders', label: 'Pending Orders', to: '/admin/orders' },
  { key: 'lowStockProducts', label: 'Low Stock Accessories', to: '/admin/products' },
  { key: 'totalProducts', label: 'Total Active Accessories', to: '/admin/products' },
  { key: 'availablePhones', label: 'Secondhand Phones Available', to: '/admin/secondhand' },
  { key: 'totalOrders', label: 'Total Orders', to: '/admin/orders' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then((res) => setStats(res.data));
  }, []);

  if (!stats) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900 mb-6">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c) => (
          <Link
            key={c.key}
            to={c.to}
            className="bg-white border border-navy-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-3xl font-bold text-navy-900">{stats[c.key]}</p>
            <p className="text-sm text-navy-500 mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      <ProfitPanel />
    </div>
  );
}
