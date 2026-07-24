import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Loading from '../components/Loading';

const emptyForm = { name: '', email: '', phone: '', password: '' };

export default function CustomersAdmin() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, object = edit
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api.get('/customers').then((res) => setCustomers(res.data)).finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openNew() {
    setForm(emptyForm);
    setEditing({});
  }

  function openEdit(c) {
    setForm({ name: c.name, email: c.email, phone: c.phone || '', password: '' });
    setEditing(c);
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing.id) {
        const payload = { name: form.name, email: form.email, phone: form.phone };
        if (form.password) payload.password = form.password;
        await api.put(`/customers/${editing.id}`, payload);
        toast.success('Customer updated');
      } else {
        await api.post('/customers', form);
        toast.success('Customer created');
      }
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save customer');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(c) {
    if (!confirm(`Delete customer "${c.name}" (${c.email})? This cannot be undone.`)) return;
    try {
      await api.delete(`/customers/${c.id}`);
      toast.success('Customer deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Customers</h1>
        <button onClick={openNew} className="bg-navy-800 text-white font-semibold px-4 py-2 rounded-md hover:bg-navy-700">
          + Add Customer
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="bg-white rounded-xl border border-navy-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-navy-50 text-navy-500 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Joined</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {customers.map((c) => (
                <tr key={c.id}>
                  <td className="p-3 font-medium text-navy-900">{c.name}</td>
                  <td className="p-3 text-navy-500">{c.email}</td>
                  <td className="p-3 text-navy-500">{c.phone || '—'}</td>
                  <td className="p-3 text-navy-400 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={() => openEdit(c)} className="text-navy-700 hover:text-navy-900 font-medium">Edit</button>
                    <button onClick={() => handleDelete(c)} className="text-red-500 hover:text-red-600 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-navy-400">No customers have signed up yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-navy-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-navy-900 mb-4">{editing.id ? 'Edit Customer' : 'New Customer'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Name</label>
                <input required value={form.name} onChange={(e) => update('name', e.target.value)}
                  className="w-full border border-navy-200 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Email</label>
                <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                  className="w-full border border-navy-200 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Phone</label>
                <input value={form.phone} onChange={(e) => update('phone', e.target.value)}
                  className="w-full border border-navy-200 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">
                  Password {editing.id && <span className="text-navy-400 font-normal">(leave blank to keep current)</span>}
                </label>
                <input type="password" required={!editing.id} value={form.password} onChange={(e) => update('password', e.target.value)}
                  className="w-full border border-navy-200 rounded-md px-3 py-2" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditing(null)}
                  className="flex-1 border border-navy-200 rounded-md py-2 font-medium text-navy-700 hover:bg-navy-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-navy-800 text-white rounded-md py-2 font-semibold hover:bg-navy-700 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
