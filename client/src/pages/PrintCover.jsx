import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Field from '../components/FormField';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  deviceBrand: '',
  deviceModel: '',
  notes: '',
};

export default function PrintCover() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
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

  useEffect(() => {
    if (!photo) {
      setPreview(null);
      return undefined;
    }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!photo) {
      toast.error('Please upload the photo you want printed on your cover');
      return;
    }
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      data.append('photo', photo);
      await api.post('/print-covers', data);
      toast.success('Print cover request submitted! We will contact you shortly.');
      if (user) navigate('/account/print-covers');
      else {
        setForm(initialForm);
        setPhoto(null);
      }
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </span>
        <h1 className="text-3xl font-bold text-navy-900">Customised Photo Print Cover</h1>
      </div>
      <p className="text-navy-500 mb-8">
        Upload your favourite photo and tell us your phone model — we'll print it on a durable cover
        and call you to confirm price and pickup.
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
          <label className="block text-sm font-medium text-navy-700 mb-1">Photo to Print</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setPhoto(e.target.files[0] || null)}
            className="w-full text-sm"
          />
          {preview && (
            <img src={preview} alt="Preview" className="mt-3 h-40 w-40 object-cover rounded-lg border border-navy-100 shadow-sm" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Notes (optional)</label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            className="w-full border border-navy-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navy-400"
            placeholder="Any cropping preference, matte/glossy finish, etc."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-navy-800 text-white font-semibold py-3 rounded-md transition-all duration-200 hover:bg-navy-700 hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100"
        >
          {submitting ? 'Submitting...' : 'Submit Print Request'}
        </button>
      </form>
    </div>
  );
}
