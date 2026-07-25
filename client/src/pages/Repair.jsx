import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Field from '../components/FormField';

const ISSUE_TYPES = ['Display', 'Battery', 'Charging Pin', 'Speaker/Mic', 'Other'];

const initialForm = {
  name: '',
  phone: '',
  email: '',
  deviceBrand: '',
  deviceModel: '',
  issueType: 'Display',
  issueDescription: '',
};

export default function Repair() {
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
      await api.post('/repairs', form);
      toast.success('Repair request submitted! We will contact you shortly.');
      if (user) navigate('/account/repairs');
      else setForm({ ...initialForm });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <span className="h-10 w-10 rounded-full bg-navy-800 text-gold-400 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5a3 3 0 015.9-1.2l-3.3 3.3 1.3 1.3 3.3-3.3A3 3 0 0116 9.9L7.6 18.3a2 2 0 11-2.9-2.9L13.1 7a3 3 0 01-2.1-2z" />
          </svg>
        </span>
        <h1 className="text-3xl font-bold text-navy-900">Book a Repair</h1>
      </div>
      <p className="text-navy-500 mb-8">
        Tell us what's wrong and we'll get back to you on call/WhatsApp to confirm timing and cost.
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-navy-100 border-t-4 border-t-gold-400 rounded-xl p-6 space-y-4 shadow-lg">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your Name" required value={form.name} onChange={(v) => update('name', v)} />
          <Field label="Phone Number" required value={form.phone} onChange={(v) => update('phone', v)} />
        </div>
        <Field label="Email (optional)" type="email" value={form.email} onChange={(v) => update('email', v)} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Device Brand" required value={form.deviceBrand} onChange={(v) => update('deviceBrand', v)} placeholder="e.g. Samsung" />
          <Field label="Device Model" required value={form.deviceModel} onChange={(v) => update('deviceModel', v)} placeholder="e.g. Galaxy M31" />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Issue Type</label>
          <select
            value={form.issueType}
            onChange={(e) => update('issueType', e.target.value)}
            className="w-full border border-navy-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navy-400"
          >
            {ISSUE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Describe the Issue</label>
          <textarea
            rows={4}
            value={form.issueDescription}
            onChange={(e) => update('issueDescription', e.target.value)}
            className="w-full border border-navy-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navy-400"
            placeholder="e.g. Screen is cracked in the corner, touch doesn't respond on left side."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-navy-800 text-white font-semibold py-3 rounded-md transition-all duration-200 hover:bg-navy-700 hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100"
        >
          {submitting ? 'Submitting...' : 'Submit Repair Request'}
        </button>
      </form>
    </div>
  );
}
