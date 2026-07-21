import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
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
      <div className="aspect-square bg-navy-50 flex items-center justify-center overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <span className="text-navy-300 text-sm">No image</span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <span className="text-xs uppercase tracking-wide text-gold-600 font-semibold">
          {product.category}
        </span>
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
