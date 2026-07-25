import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Field from '../components/FormField';

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerName: user?.name || '',
    phone: user?.phone || '',
    address: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-navy-500 mb-6">Your cart is empty.</p>
        <Link to="/products" className="bg-navy-800 text-white font-semibold px-5 py-2.5 rounded-md hover:bg-navy-700">
          Shop Now
        </Link>
      </div>
    );
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/orders', { ...form, items });
      toast.success('Order placed! We will call you to confirm.');
      clearCart();
      navigate('/account/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 mb-4">Checkout</h1>
        <form onSubmit={handleSubmit} className="bg-white border border-navy-100 border-t-4 border-t-gold-400 rounded-xl p-6 space-y-4 shadow-lg">
          <Field label="Full Name" required value={form.customerName} onChange={(v) => update('customerName', v)} />
          <Field label="Phone Number" required value={form.phone} onChange={(v) => update('phone', v)} />
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Delivery / Pickup Address</label>
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              className="w-full border border-navy-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navy-400"
              placeholder="Leave blank if picking up in-store"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Notes (optional)</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              className="w-full border border-navy-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navy-400"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold-400 text-navy-900 font-bold py-3 rounded-md transition-all duration-200 hover:bg-gold-300 hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100"
          >
            {submitting ? 'Placing order...' : `Place Order — ₹${totalAmount}`}
          </button>
          <p className="text-xs text-navy-400 text-center">
            No online payment required. Our team will call you to confirm and arrange payment.
          </p>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-navy-800 mb-4">Order Summary</h2>
        <div className="bg-navy-50 rounded-xl p-4 divide-y divide-navy-100">
          {items.map((item) => (
            <div key={item.itemId} className="flex justify-between py-2 text-sm">
              <span className="text-navy-700">{item.name} × {item.qty}</span>
              <span className="font-medium text-navy-900">₹{item.price * item.qty}</span>
            </div>
          ))}
          <div className="flex justify-between py-3 font-bold text-navy-900">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
