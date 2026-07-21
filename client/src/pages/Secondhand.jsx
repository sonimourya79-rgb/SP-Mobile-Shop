import { useEffect, useState } from 'react';
import api from '../api/axios';
import PhoneCard from '../components/PhoneCard';
import Loading from '../components/Loading';

const CONDITIONS = ['All', 'Excellent', 'Good', 'Fair'];

export default function Secondhand() {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [condition, setCondition] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (condition !== 'All') params.condition = condition;
    if (search) params.search = search;
    api
      .get('/secondhand', { params })
      .then((res) => setPhones(res.data))
      .finally(() => setLoading(false));
  }, [condition, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-navy-900 mb-6">Secondhand Phones</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by brand or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-navy-200 rounded-md px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-navy-400"
        />
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="border border-navy-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navy-400"
        >
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loading />
      ) : phones.length === 0 ? (
        <p className="text-navy-400 text-center py-16">No secondhand phones available right now.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {phones.map((p) => (
            <PhoneCard key={p._id} phone={p} />
          ))}
        </div>
      )}
    </div>
  );
}
