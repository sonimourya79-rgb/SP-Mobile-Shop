import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Field from '../components/FormField';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      const from = location.state?.from?.pathname;
      navigate(from || (user.role === 'admin' ? '/admin' : '/'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-6">
        <img src="/logo.jpg" alt="SP Mobile" className="h-16 w-auto mx-auto rounded-lg shadow-md mb-4" />
        <h1 className="text-2xl font-bold text-navy-900">Welcome Back</h1>
        <p className="text-sm text-navy-400 mt-1">Login to track your orders, repairs and sell requests</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white border border-navy-100 border-t-4 border-t-gold-400 rounded-xl p-6 sm:p-8 space-y-4 shadow-lg">
        <Field label="Email" type="email" required value={email} onChange={setEmail} />
        <Field label="Password" type="password" required value={password} onChange={setPassword} />
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-navy-800 text-white font-semibold py-3 rounded-md transition-all duration-200 hover:bg-navy-700 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
        >
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="text-center text-sm text-navy-500 mt-5">
        Don't have an account?{' '}
        <Link to="/register" className="text-navy-800 font-semibold hover:text-gold-600">Sign Up</Link>
      </p>
    </div>
  );
}
