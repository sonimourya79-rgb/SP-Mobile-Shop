import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/products', label: 'Accessories' },
  { to: '/admin/secondhand', label: 'Secondhand Phones' },
  { to: '/admin/repairs', label: 'Repair Requests' },
  { to: '/admin/sell-requests', label: 'Sell Requests' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/messages', label: 'Contact Messages' },
  { to: '/admin/send-offer', label: 'Send Offer' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-navy-50">
      <aside className="w-60 shrink-0 bg-navy-900 text-white flex flex-col">
        <Link to="/" className="p-5 text-xl font-bold border-b border-navy-800">
          <span className="text-gold-400">SP</span> Mobile <span className="text-xs font-normal text-navy-300 block">Admin Panel</span>
        </Link>
        <nav className="flex-1 py-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `block px-5 py-2.5 text-sm font-medium ${
                  isActive ? 'bg-gold-400 text-navy-900' : 'text-navy-100 hover:bg-navy-700'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-navy-800 text-sm">
          <p className="text-navy-300 mb-2 truncate">{user?.name}</p>
          <button onClick={logout} className="w-full bg-navy-700 hover:bg-navy-600 rounded-md py-2">
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-8 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}
