import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/account/orders', label: 'My Orders' },
  { to: '/account/repairs', label: 'My Repairs' },
  { to: '/account/sell-requests', label: 'Sell Requests' },
  { to: '/account/profile', label: 'Profile' },
];

export default function AccountTabs() {
  return (
    <div className="flex gap-2 border-b border-navy-100 mb-6 overflow-x-auto">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) =>
            `px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 ${
              isActive ? 'border-gold-400 text-navy-900' : 'border-transparent text-navy-400 hover:text-navy-700'
            }`
          }
        >
          {t.label}
        </NavLink>
      ))}
    </div>
  );
}
