import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Field from '../components/FormField';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await register(form);
      toast.success(`Welcome, ${user.name.split(' ')[0]}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-navy-900 mb-6 text-center">Create an Account</h1>
      <form onSubmit={handleSubmit} className="bg-white border border-navy-100 rounded-xl p-6 space-y-4 shadow-sm">
        <Field label="Full Name" required value={form.name} onChange={(v) => update('name', v)} />
        <Field label="Email" type="email" required value={form.email} onChange={(v) => update('email', v)} />
        <Field label="Phone Number" required value={form.phone} onChange={(v) => update('phone', v)} />
        <Field label="Password" type="password" required value={form.password} onChange={(v) => update('password', v)} />
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-navy-800 text-white font-semibold py-3 rounded-md hover:bg-navy-700 disabled:opacity-50"
        >
          {submitting ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p className="text-center text-sm text-navy-500 mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-navy-800 font-semibold hover:text-gold-600">Login</Link>
      </p>
    </div>
  );
}
