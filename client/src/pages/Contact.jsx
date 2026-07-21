import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Field from '../components/FormField';

const initialForm = { name: '', email: '', phone: '', subject: 'General Inquiry', message: '' };
const MAP_EMBED_SRC = 'https://www.google.com/maps?cid=3123725002817306683&output=embed';
const MAP_LINK = 'https://maps.app.goo.gl/qZqxhzqyMeV4A39Z8';

export default function Contact() {
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      name: f.name || user.name || '',
      email: f.email || user.email || '',
      phone: f.phone || user.phone || '',
    }));
  }, [user]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/contact', form);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ ...initialForm, name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold text-navy-900 mb-6">Contact Us</h1>
      <div className="grid gap-8 md:grid-cols-2 items-stretch">
        <div className="flex flex-col">
          <div className="rounded-xl overflow-hidden border border-navy-100 shadow-sm flex-1 min-h-80">
            <iframe
              title="SP Mobile shop location"
              src={MAP_EMBED_SRC}
              className="w-full h-full min-h-80"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm space-y-3 mt-4">
            <div>
              <h3 className="text-xs uppercase tracking-wide text-gold-600 font-semibold">Phone</h3>
              <a href="tel:9653206528" className="text-navy-800 hover:text-gold-600">9653206528</a>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wide text-gold-600 font-semibold">Email</h3>
              <a href="mailto:aa6871678@gmail.com" className="text-navy-800 hover:text-gold-600">aa6871678@gmail.com</a>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wide text-gold-600 font-semibold">Address</h3>
              <p className="text-navy-800">Appapada, Malad East, Auto Stand Near 624 Bus Stop</p>
              <a
                href={MAP_LINK}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-navy-500 hover:text-gold-600 underline underline-offset-2"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-navy-800 mb-4">Send us a message</h2>
          <form onSubmit={handleSubmit} className="bg-white border border-navy-100 rounded-xl p-6 space-y-4 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your Name" required value={form.name} onChange={(v) => update('name', v)} />
              <Field label="Phone (optional)" value={form.phone} onChange={(v) => update('phone', v)} />
            </div>
            <Field label="Email" type="email" required value={form.email} onChange={(v) => update('email', v)} />
            <Field label="Subject" value={form.subject} onChange={(v) => update('subject', v)} />
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Message</label>
              <textarea
                rows={6}
                required
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                className="w-full border border-navy-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navy-400"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-navy-800 text-white font-semibold py-3 rounded-md hover:bg-navy-700 disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
