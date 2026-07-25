import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import NotificationBell from './NotificationBell';

const links = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/products', label: 'Accessories', icon: 'grid' },
  { to: '/secondhand', label: 'Secondhand Phones', icon: 'phone' },
  { to: '/repair', label: 'Repair', icon: 'wrench' },
  { to: '/sell-phone', label: 'Sell Your Phone', icon: 'tag' },
  { to: '/contact', label: 'Contact', icon: 'mail' },
];

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
    isActive ? 'bg-gold-400 text-navy-900' : 'text-navy-50 hover:bg-navy-700 hover:scale-105'
  }`;

function NavIcon({ name, className = 'w-5 h-5' }) {
  const paths = {
    home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    grid: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
    phone: 'M8 3a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H8zm4 16h.01',
    wrench: 'M11 5a3 3 0 015.9-1.2l-3.3 3.3 1.3 1.3 3.3-3.3A3 3 0 0116 9.9L7.6 18.3a2 2 0 11-2.9-2.9L13.1 7a3 3 0 01-2.1-2z',
    tag: 'M7 7h.01M7 3h5a1 1 0 01.7.3l8 8a1 1 0 010 1.4l-6 6a1 1 0 01-1.4 0l-8-8A1 1 0 015 10V5a2 2 0 012-2z',
    mail: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    cart: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m-10 4a1 1 0 102 0 1 1 0 00-2 0zm10 0a1 1 0 102 0 1 1 0 00-2 0z',
    user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    logout: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V6a3 3 0 013-3h4a3 3 0 013 3v1',
    userPlus: 'M12 4a4 4 0 100 8 4 4 0 000-8zM6 21v-2a4 4 0 014-4h2M19 8v6m3-3h-6',
  };
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={paths[name] || paths.home} />
    </svg>
  );
}

const mobileLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-gold-400 text-navy-900' : 'text-navy-100 hover:bg-navy-800'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  function handleLogout() {
    setOpen(false);
    logout();
    navigate('/');
  }

  return (
    <header className="bg-navy-900 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0 py-1.5 group">
            <img src="/logo.jpg" alt="SP Mobile" className="h-11 w-auto rounded-md transition-transform duration-200 group-hover:scale-105" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={navLinkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {user && <NotificationBell />}
            <Link to="/cart" className="relative text-navy-50 hover:text-gold-400 transition-colors px-2 py-2">
              Cart
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-400 text-navy-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-glow-pulse">
                  {totalCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={user.role === 'admin' ? '/admin' : '/account/orders'}
                  className="text-sm text-navy-50 hover:text-gold-400 transition-colors"
                >
                  {user.role === 'admin' ? 'Admin Panel' : `Hi, ${user.name.split(' ')[0]}`}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm bg-navy-700 text-white px-3 py-1.5 rounded-md transition-all duration-200 hover:bg-navy-600 hover:scale-105"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-navy-50 hover:text-gold-400 transition-colors px-2">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-gold-400 text-navy-900 font-semibold px-3 py-1.5 rounded-md transition-all duration-200 hover:bg-gold-300 hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            {user && <NotificationBell />}
            <Link to="/cart" className="relative text-navy-50 p-2" aria-label="Cart">
              <NavIcon name="cart" />
              {totalCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-gold-400 text-navy-900 text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </Link>
            <button
              className="text-white p-2"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" /> : <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-navy-900 border-t border-navy-800 ${
          open ? 'max-h-144' : 'max-h-0 border-t-0'
        }`}
      >
        <div className="px-3 py-3 space-y-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={mobileLinkClass}>
              <NavIcon name={l.icon} />
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="border-t border-navy-800 px-3 py-3 space-y-1">
          {user ? (
            <>
              <NavLink
                to={user.role === 'admin' ? '/admin' : '/account/orders'}
                className={mobileLinkClass}
              >
                <NavIcon name="user" />
                {user.role === 'admin' ? 'Admin Panel' : `Hi, ${user.name.split(' ')[0]}`}
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-navy-100 hover:bg-navy-800"
              >
                <NavIcon name="logout" />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={mobileLinkClass}>
                <NavIcon name="user" />
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold bg-gold-400 text-navy-900"
              >
                <NavIcon name="userPlus" />
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
