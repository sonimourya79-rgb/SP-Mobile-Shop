import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import FloatingAccessoryIcons from '../components/FloatingAccessoryIcons';
import QuickContactBar from '../components/QuickContactBar';
import ProductCard from '../components/ProductCard';
import PhoneCard from '../components/PhoneCard';
import Loading from '../components/Loading';

const services = [
  { title: 'Display Change', desc: 'Cracked or dead screen replacement for all major brands.' },
  { title: 'Battery Replacement', desc: 'Original-spec batteries with warranty.' },
  { title: 'Charging Pin Repair', desc: 'Fix slow or no-charging issues fast.' },
  { title: 'Speaker / Mic Repair', desc: 'Restore call and media audio quality.' },
  { title: 'Tempered Glass & Covers', desc: 'Protect your phone in style.' },
  { title: 'Customised Photo Print Covers', desc: 'Get your own photo printed on a durable phone cover.' },
  { title: 'Buy & Sell Old Phones', desc: 'Best price for your used phone, or grab a great deal.' },
];

const trustBadges = [
  {
    title: 'Genuine Accessories',
    desc: 'Quality-checked products, never compromised.',
    path: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9a12.02 12.02 0 00-.382-3.016z',
  },
  {
    title: 'Expert Technicians',
    desc: 'Experienced hands for every repair job.',
    path: 'M11 5a3 3 0 015.9-1.2l-3.3 3.3 1.3 1.3 3.3-3.3A3 3 0 0116 9.9L7.6 18.3a2 2 0 11-2.9-2.9L13.1 7a3 3 0 01-2.1-2z',
  },
  {
    title: 'Quick Turnaround',
    desc: 'Most repairs done same day.',
    path: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'Best Price Guarantee',
    desc: 'Fair, transparent pricing — every time.',
    path: 'M7 7h.01M7 3h5a1 1 0 01.7.3l8 8a1 1 0 010 1.4l-6 6a1 1 0 01-1.4 0l-8-8A1 1 0 015 10V5a2 2 0 012-2z',
  },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState(null);
  const [featuredPhones, setFeaturedPhones] = useState(null);

  useEffect(() => {
    api.get('/products').then((res) => setFeaturedProducts(res.data.slice(0, 4)));
    api.get('/secondhand').then((res) => setFeaturedPhones(res.data.slice(0, 4)));
  }, []);

  return (
    <div>
      <section className="relative bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-starfield pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 pt-10">
          <FloatingAccessoryIcons />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <p className="text-gold-400 font-semibold tracking-wide uppercase text-sm mb-2">
              ॐ नमः शिवाय — Shiv Shakti Blessings
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">SP</span> Mobile
            </h1>
            <p className="text-lg text-navy-100 mb-6">
              Accessories &middot; Repairing &middot; Second Hand Phones — Best Mobile Service in
              Appapada, Malad East.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="animate-glow-pulse bg-gold-400 text-navy-900 font-semibold px-5 py-3 rounded-md transition-all duration-200 hover:bg-gold-300 hover:scale-105"
              >
                Shop Accessories
              </Link>
              <Link
                to="/repair"
                className="bg-navy-700 text-white font-semibold px-5 py-3 rounded-md border border-navy-500 transition-all duration-200 hover:bg-navy-600 hover:scale-105"
              >
                Book a Repair
              </Link>
              <Link
                to="/sell-phone"
                className="bg-transparent text-white font-semibold px-5 py-3 rounded-md border border-navy-500 transition-all duration-200 hover:bg-navy-800 hover:scale-105"
              >
                Sell Your Phone
              </Link>
            </div>
          </div>
          <div className="bg-navy-800/80 backdrop-blur rounded-2xl p-6 border border-navy-700 transition-transform duration-300 hover:-translate-y-1">
            <h2 className="text-xl font-semibold mb-4 text-gold-400">Visit / Contact Us</h2>
            <ul className="space-y-3 text-navy-100">
              <li className="flex gap-2">
                <span className="text-gold-400">Mo.:</span>
                <a href="tel:9653206528" className="hover:text-gold-400 transition-colors">9653206528</a>
              </li>
              <li className="flex gap-2">
                <span className="text-gold-400">Email:</span>
                <a href="mailto:spmobiletechnology@gmail.com" className="hover:text-gold-400 transition-colors">spmobiletechnology@gmail.com</a>
              </li>
              <li className="flex gap-2">
                <span className="text-gold-400">Address:</span>
                <span>Appapada, Malad East, Auto Stand Near 624 Bus Stop</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustBadges.map((b) => (
            <div key={b.title} className="text-center px-2">
              <span className="h-14 w-14 rounded-full bg-navy-800 text-gold-400 flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d={b.path} />
                </svg>
              </span>
              <h3 className="font-semibold text-navy-900 mb-1">{b.title}</h3>
              <p className="text-sm text-navy-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy-50 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-navy-900">Popular Accessories</h2>
            <Link to="/products" className="text-navy-700 font-semibold hover:text-gold-600 transition-colors text-sm">
              View All &rarr;
            </Link>
          </div>
          {featuredProducts === null ? (
            <Loading />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-navy-900">Secondhand Phones in Stock</h2>
          <Link to="/secondhand" className="text-navy-700 font-semibold hover:text-gold-600 transition-colors text-sm">
            View All &rarr;
          </Link>
        </div>
        {featuredPhones === null ? (
          <Loading />
        ) : featuredPhones.length === 0 ? (
          <p className="text-navy-400 text-center py-8">No secondhand phones available right now.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredPhones.map((p) => (
              <PhoneCard key={p._id} phone={p} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-navy-50 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-navy-900 mb-8 text-center">Our Services</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gold-300"
              >
                <h3 className="font-semibold text-navy-800 mb-1">{s.title}</h3>
                <p className="text-sm text-navy-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <QuickContactBar />
    </div>
  );
}
