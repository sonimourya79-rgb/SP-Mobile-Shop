import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative text-navy-50 hover:text-gold-400 transition-colors p-2"
        aria-label="Notifications"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center animate-glow-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-xl shadow-xl border border-navy-100 z-50 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between p-3 border-b border-navy-50 sticky top-0 bg-white">
              <span className="font-semibold text-navy-900 text-sm">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-navy-500 hover:text-gold-600">
                  Mark all read
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-navy-400 text-center py-8">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n._id}
                  to={n.link || '#'}
                  onClick={() => {
                    markRead(n._id);
                    setOpen(false);
                  }}
                  className={`block px-4 py-3 text-sm border-b border-navy-50 last:border-0 hover:bg-navy-50 ${
                    n.read ? 'text-navy-500' : 'text-navy-900 font-medium bg-gold-50'
                  }`}
                >
                  {n.message}
                  <div className="text-xs text-navy-300 mt-0.5">{new Date(n.createdAt).toLocaleString()}</div>
                </Link>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
