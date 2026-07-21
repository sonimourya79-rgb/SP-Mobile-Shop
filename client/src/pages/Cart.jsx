import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { resolveImage } from '../api/config';

export default function Cart() {
  const { items, updateQty, removeItem, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-navy-900 mb-3">Your cart is empty</h1>
        <p className="text-navy-500 mb-6">Browse our accessories or secondhand phones to get started.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/products" className="bg-navy-800 text-white font-semibold px-5 py-2.5 rounded-md hover:bg-navy-700">
            Shop Accessories
          </Link>
          <Link to="/secondhand" className="bg-navy-100 text-navy-800 font-semibold px-5 py-2.5 rounded-md hover:bg-navy-200">
            Secondhand Phones
          </Link>
        </div>
      </div>
    );
  }

  function handleCheckout() {
    if (!user) return navigate('/login', { state: { from: { pathname: '/checkout' } } });
    navigate('/checkout');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-navy-900 mb-6">Your Cart</h1>
      <div className="bg-white border border-navy-100 rounded-xl divide-y divide-navy-100 shadow-sm">
        {items.map((item) => (
          <div key={item.itemId} className="flex items-center gap-4 p-4">
            <div className="h-16 w-16 bg-navy-50 rounded-md overflow-hidden flex items-center justify-center shrink-0">
              {item.image ? (
                <img src={resolveImage(item.image)} alt={item.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs text-navy-300">No image</span>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-navy-900">{item.name}</p>
              <p className="text-sm text-navy-500">₹{item.price} {item.itemType === 'SecondhandPhone' && '(unique item)'}</p>
            </div>
            {item.itemType === 'Product' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQty(item.itemId, item.qty - 1)}
                  className="h-8 w-8 rounded-md border border-navy-200 hover:bg-navy-50"
                >
                  -
                </button>
                <span className="w-6 text-center">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.itemId, item.qty + 1)}
                  className="h-8 w-8 rounded-md border border-navy-200 hover:bg-navy-50"
                >
                  +
                </button>
              </div>
            ) : (
              <span className="text-sm text-navy-400">Qty: 1</span>
            )}
            <p className="w-20 text-right font-semibold text-navy-800">₹{item.price * item.qty}</p>
            <button
              onClick={() => removeItem(item.itemId)}
              className="text-red-500 hover:text-red-600 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6 bg-navy-50 rounded-xl p-6">
        <span className="text-lg font-semibold text-navy-800">Total</span>
        <span className="text-2xl font-bold text-navy-900">₹{totalAmount}</span>
      </div>

      <button
        onClick={handleCheckout}
        className="w-full mt-6 bg-gold-400 text-navy-900 font-bold py-3 rounded-md hover:bg-gold-300"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
