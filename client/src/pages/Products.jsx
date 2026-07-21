import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

const CATEGORIES = [
  'All',
  'Tempered Glass',
  'Back Cover',
  'Charger',
  'Charging Cable',
  'Power Bank',
  'Battery',
  'Wired Earphones',
  'Neckband Bluetooth',
  'Bluetooth Earbuds',
  'Bluetooth Speaker',
  'Mobile Holder',
  'OTG & Adapters',
  'Other',
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category !== 'All') params.category = category;
    if (search) params.search = search;
    api
      .get('/products', { params })
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-navy-900 mb-6">Accessories</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search accessories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-navy-200 rounded-md px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-navy-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-navy-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navy-400"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loading />
      ) : products.length === 0 ? (
        <p className="text-navy-400 text-center py-16">No accessories found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
