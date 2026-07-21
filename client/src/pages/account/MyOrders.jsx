import { useEffect, useState } from 'react';
import api from '../../api/axios';
import AccountTabs from '../../components/AccountTabs';
import StatusBadge from '../../components/StatusBadge';
import Loading from '../../components/Loading';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/mine').then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-navy-900 mb-4">My Account</h1>
      <AccountTabs />

      {loading ? (
        <Loading />
      ) : orders.length === 0 ? (
        <p className="text-navy-400 text-center py-16">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-navy-100 rounded-xl p-5 shadow-sm">
              <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <span className="text-sm text-navy-400">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
                <StatusBadge status={order.status} />
              </div>
              <div className="divide-y divide-navy-50">
                {order.items.map((item) => (
                  <div key={item.itemId} className="flex justify-between py-1.5 text-sm">
                    <span className="text-navy-700">{item.name} × {item.qty}</span>
                    <span className="font-medium text-navy-900">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-3 mt-2 border-t border-navy-100 font-semibold text-navy-900">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
