import { useState } from 'react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="min-h-screen flex bg-navy-50">
      {/* Mobile hamburger button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-40 bg-navy-900 text-white rounded-md p-2 shadow-lg"
        aria-label="Open sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Backdrop overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-navy-950/60"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar — always visible on desktop, overlay drawer on mobile */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-60 bg-navy-900 text-white flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between p-5 border-b border-navy-800">
          <Link to="/" className="text-xl font-bold" onClick={closeSidebar}>
            <span className="text-gold-400">SP</span> Mobile
          </Link>
          {/* Close button on mobile */}
          <button
            onClick={closeSidebar}
            className="lg:hidden text-navy-300 hover:text-white"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <span className="hidden lg:block px-5 -mt-2 mb-1 text-xs font-normal text-navy-300">Admin Panel</span>
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={closeSidebar}
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

      {/* Main content area */}
      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-x-auto min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
