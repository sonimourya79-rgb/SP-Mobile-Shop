import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);
const POLL_INTERVAL_MS = 20000;

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const refresh = useCallback(() => {
    if (!user) return;
    api
      .get('/notifications/mine')
      .then((res) => setNotifications(res.data))
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return undefined;
    }
    refresh();
    const id = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [user, refresh]);

  async function markRead(id) {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    try {
      await api.put(`/notifications/${id}/read`);
    } catch {
      // best-effort — next poll will reconcile
    }
  }

  async function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.put('/notifications/read-all');
    } catch {
      // best-effort — next poll will reconcile
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, refresh }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
