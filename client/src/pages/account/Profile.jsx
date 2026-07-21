import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AccountTabs from '../../components/AccountTabs';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-navy-900 mb-4">My Account</h1>
      <AccountTabs />

      <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm max-w-md">
        <dl className="space-y-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-gold-600 font-semibold">Name</dt>
            <dd className="text-navy-900">{user.name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-gold-600 font-semibold">Email</dt>
            <dd className="text-navy-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-gold-600 font-semibold">Phone</dt>
            <dd className="text-navy-900">{user.phone || '—'}</dd>
          </div>
        </dl>
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-navy-800 text-white font-semibold py-2.5 rounded-md hover:bg-navy-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
