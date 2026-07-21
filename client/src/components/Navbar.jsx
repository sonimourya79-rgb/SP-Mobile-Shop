import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Accessories' },
  { to: '/secondhand', label: 'Secondhand Phones' },
  { to: '/repair', label: 'Repair' },
  { to: '/sell-phone', label: 'Sell Your Phone' },
  { to: '/contact', label: 'Contact' },
];

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
    isActive ? 'bg-gold-400 text-navy-900' : 'text-navy-50 hover:bg-navy-700 hover:scale-105'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
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

          <button
            className="lg:hidden text-white p-2"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-navy-900 border-t border-navy-700 px-4 pb-4 space-y-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navLinkClass} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/cart" className={navLinkClass} onClick={() => setOpen(false)}>
            Cart ({totalCount})
          </NavLink>
          {user ? (
            <>
              <NavLink
                to={user.role === 'admin' ? '/admin' : '/account/orders'}
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                {user.role === 'admin' ? 'Admin Panel' : 'My Account'}
              </NavLink>
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-navy-50 hover:bg-navy-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass} onClick={() => setOpen(false)}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClass} onClick={() => setOpen(false)}>
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
