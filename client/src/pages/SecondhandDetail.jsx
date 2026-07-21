import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import Loading from '../components/Loading';

export default function SecondhandDetail() {
  const { id } = useParams();
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const { addItem, items } = useCart();

  useEffect(() => {
    setLoading(true);
    api
      .get(`/secondhand/${id}`)
      .then((res) => setPhone(res.data))
      .catch(() => setPhone(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!phone) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-navy-500 mb-4">Phone not found.</p>
        <Link to="/secondhand" className="text-navy-700 underline">Back to Secondhand Phones</Link>
      </div>
    );
  }

  const alreadyInCart = items.some((i) => i.itemId === phone._id);

  function handleAdd() {
    addItem(phone, 'SecondhandPhone');
    toast.success(`${phone.brand} ${phone.model} added to cart`);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-2">
      <div>
        <div className="aspect-square bg-navy-50 rounded-xl overflow-hidden flex items-center justify-center mb-3">
          {phone.images?.length ? (
            <img src={phone.images[activeImg]} alt={`${phone.brand} ${phone.model}`} className="w-full h-full object-cover" />
          ) : (
            <span className="text-navy-300">No image</span>
          )}
        </div>
        {phone.images?.length > 1 && (
          <div className="flex gap-2">
            {phone.images.map((img, idx) => (
              <button
                key={img}
                onClick={() => setActiveImg(idx)}
                className={`h-16 w-16 rounded-md overflow-hidden border-2 ${
                  idx === activeImg ? 'border-gold-400' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <span className="text-xs uppercase tracking-wide text-gold-600 font-semibold">
          {phone.condition} Condition
        </span>
        <h1 className="text-2xl font-bold text-navy-900 mt-1 mb-1">{phone.brand} {phone.model}</h1>
        <p className="text-sm text-navy-400 mb-3">{[phone.storage, phone.color].filter(Boolean).join(' · ')}</p>
        <p className="text-2xl font-bold text-navy-700 mb-4">₹{phone.price}</p>
        <p className="text-navy-500 mb-6 whitespace-pre-line">{phone.description || 'No description available.'}</p>
        <button
          disabled={phone.status !== 'available' || alreadyInCart}
          onClick={handleAdd}
          className="bg-navy-800 text-white font-semibold px-6 py-3 rounded-md hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {phone.status !== 'available' ? 'Sold Out' : alreadyInCart ? 'Already in Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
