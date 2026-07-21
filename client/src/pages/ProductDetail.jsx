import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { resolveImage } from '../api/config';
import { useCart } from '../context/CartContext';
import Loading from '../components/Loading';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-navy-500 mb-4">Product not found.</p>
        <Link to="/products" className="text-navy-700 underline">Back to Accessories</Link>
      </div>
    );
  }

  function handleAdd() {
    addItem(product, 'Product');
    toast.success(`${product.name} added to cart`);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-2">
      <div>
        <div className="aspect-square bg-navy-50 rounded-xl overflow-hidden flex items-center justify-center mb-3">
          {product.images?.length ? (
            <img src={resolveImage(product.images[activeImg])} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-navy-300">No image</span>
          )}
        </div>
        {product.images?.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img, idx) => (
              <button
                key={img}
                onClick={() => setActiveImg(idx)}
                className={`h-16 w-16 rounded-md overflow-hidden border-2 ${
                  idx === activeImg ? 'border-gold-400' : 'border-transparent'
                }`}
              >
                <img src={resolveImage(img)} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <span className="text-xs uppercase tracking-wide text-gold-600 font-semibold">
          {product.category}
        </span>
        <h1 className="text-2xl font-bold text-navy-900 mt-1 mb-3">{product.name}</h1>
        <p className="text-2xl font-bold text-navy-700 mb-4">₹{product.price}</p>
        <p className="text-navy-500 mb-6 whitespace-pre-line">{product.description || 'No description available.'}</p>
        <p className="text-sm text-navy-400 mb-6">
          {product.stock > 0 ? `${product.stock} in stock` : 'Currently out of stock'}
        </p>
        <button
          disabled={product.stock <= 0}
          onClick={handleAdd}
          className="bg-navy-800 text-white font-semibold px-6 py-3 rounded-md hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
