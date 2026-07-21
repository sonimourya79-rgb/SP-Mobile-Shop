import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Field from '../components/FormField';

const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor'];

const initialForm = {
  name: '',
  phone: '',
  email: '',
  deviceBrand: '',
  deviceModel: '',
  condition: 'Good',
  expectedPrice: '',
  description: '',
};

export default function SellPhone() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      name: f.name || user.name || '',
      phone: f.phone || user.phone || '',
      email: f.email || user.email || '',
    }));
  }, [user]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/sell-requests', { ...form, expectedPrice: Number(form.expectedPrice) || 0 });
      toast.success('Sell request submitted! We will contact you shortly.');
      if (user) navigate('/account/sell-requests');
      else setForm({ ...initialForm });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-navy-900 mb-2">Sell Your Phone</h1>
      <p className="text-navy-500 mb-8">
        Give us your phone's details and expected price — we'll reach out with a fair offer.
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-navy-100 rounded-xl p-6 space-y-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your Name" required value={form.name} onChange={(v) => update('name', v)} />
          <Field label="Phone Number" required value={form.phone} onChange={(v) => update('phone', v)} />
        </div>
        <Field label="Email (optional)" type="email" value={form.email} onChange={(v) => update('email', v)} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Device Brand" required value={form.deviceBrand} onChange={(v) => update('deviceBrand', v)} placeholder="e.g. Apple" />
          <Field label="Device Model" required value={form.deviceModel} onChange={(v) => update('deviceModel', v)} placeholder="e.g. iPhone 12" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Condition</label>
            <select
              value={form.condition}
              onChange={(e) => update('condition', e.target.value)}
              className="w-full border border-navy-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navy-400"
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <Field
            label="Expected Price (₹)"
            type="number"
            value={form.expectedPrice}
            onChange={(v) => update('expectedPrice', v)}
            placeholder="e.g. 8000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Additional Details</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            className="w-full border border-navy-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navy-400"
            placeholder="Storage, color, any damage, accessories included, etc."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-navy-800 text-white font-semibold py-3 rounded-md hover:bg-navy-700 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Sell Request'}
        </button>
      </form>
    </div>
  );
}
