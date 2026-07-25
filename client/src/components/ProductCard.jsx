import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { resolveImage } from '../api/config';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  function handleAdd(e) {
    e.preventDefault();
    addItem(product, 'Product');
    toast.success(`${product.name} added to cart`);
  }

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white rounded-xl shadow-sm border border-navy-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gold-300 flex flex-col"
    >
      <div className="relative aspect-square bg-navy-50 flex items-center justify-center overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={resolveImage(product.images[0])}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <span className="text-navy-300 text-sm">No image</span>
        )}
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-navy-700 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full shadow-sm">
          {product.category}
        </span>
        {product.stock > 0 && product.stock <= 5 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
            Only {product.stock} left
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="font-semibold text-navy-900 line-clamp-2">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-navy-700">₹{product.price}</span>
          {product.stock > 0 ? (
            <button
              onClick={handleAdd}
              className="text-sm bg-navy-800 text-white px-3 py-1.5 rounded-md transition-all duration-200 hover:bg-navy-700 hover:scale-105 active:scale-95"
            >
              Add to Cart
            </button>
          ) : (
            <span className="text-xs text-red-500 font-medium">Out of stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}
