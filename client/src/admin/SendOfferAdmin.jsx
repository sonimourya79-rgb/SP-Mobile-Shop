import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function SendOfferAdmin() {
  const [audience, setAudience] = useState(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get('/offers/audience').then((res) => setAudience(res.data.count));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!confirm(`Send this email to all ${audience ?? ''} registered customers?`)) return;
    setSending(true);
    try {
      const res = await api.post('/offers/send', { subject, message });
      if (!res.data.configured) {
        toast.error('Email is not configured on the server (EMAIL_USER/EMAIL_PASS missing) — nothing was sent.');
      } else {
        toast.success(`Offer emailed to ${res.data.sent} customer(s)`);
        setSubject('');
        setMessage('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send offer');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-navy-900 mb-2">Send Offer to Customers</h1>
      <p className="text-navy-500 mb-6">
        {audience === null ? 'Loading audience...' : `This will email all ${audience} registered customer${audience === 1 ? '' : 's'}.`}
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-navy-100 rounded-xl p-6 space-y-4 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Subject</label>
          <input
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Diwali Offer — 20% off all covers & tempered glass!"
            className="w-full border border-navy-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navy-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Message</label>
          <textarea
            required
            rows={8}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your offer details here..."
            className="w-full border border-navy-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navy-400"
          />
        </div>
        <button
          type="submit"
          disabled={sending || !audience}
          className="w-full bg-gold-400 text-navy-900 font-bold py-3 rounded-md hover:bg-gold-300 disabled:opacity-50"
        >
          {sending ? 'Sending...' : 'Send to All Customers'}
        </button>
      </form>
    </div>
  );
}
