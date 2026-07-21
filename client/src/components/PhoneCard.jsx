import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { resolveImage } from '../api/config';
import toast from 'react-hot-toast';

export default function PhoneCard({ phone }) {
  const { addItem, items } = useCart();
  const alreadyInCart = items.some((i) => i.itemId === phone._id);

  function handleAdd(e) {
    e.preventDefault();
    addItem(phone, 'SecondhandPhone');
    toast.success(`${phone.brand} ${phone.model} added to cart`);
  }

  return (
    <Link
      to={`/secondhand/${phone._id}`}
      className="group bg-white rounded-xl shadow-sm border border-navy-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gold-300 flex flex-col"
    >
      <div className="aspect-square bg-navy-50 flex items-center justify-center overflow-hidden">
        {phone.images?.[0] ? (
          <img
            src={resolveImage(phone.images[0])}
            alt={`${phone.brand} ${phone.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <span className="text-navy-300 text-sm">No image</span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <span className="text-xs uppercase tracking-wide text-gold-600 font-semibold">
          {phone.condition} Condition
        </span>
        <h3 className="font-semibold text-navy-900">
          {phone.brand} {phone.model}
        </h3>
        <p className="text-xs text-navy-400">{[phone.storage, phone.color].filter(Boolean).join(' · ')}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-navy-700">₹{phone.price}</span>
          {phone.status === 'available' ? (
            <button
              disabled={alreadyInCart}
              onClick={handleAdd}
              className="text-sm bg-navy-800 text-white px-3 py-1.5 rounded-md transition-all duration-200 hover:bg-navy-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {alreadyInCart ? 'In Cart' : 'Add to Cart'}
            </button>
          ) : (
            <span className="text-xs text-red-500 font-medium">Sold</span>
          )}
        </div>
      </div>
    </Link>
  );
}
