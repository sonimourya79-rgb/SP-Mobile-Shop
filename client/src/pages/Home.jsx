import { Link } from 'react-router-dom';
import FloatingAccessoryIcons from '../components/FloatingAccessoryIcons';

const services = [
  { title: 'Display Change', desc: 'Cracked or dead screen replacement for all major brands.' },
  { title: 'Battery Replacement', desc: 'Original-spec batteries with warranty.' },
  { title: 'Charging Pin Repair', desc: 'Fix slow or no-charging issues fast.' },
  { title: 'Speaker / Mic Repair', desc: 'Restore call and media audio quality.' },
  { title: 'Tempered Glass & Covers', desc: 'Protect your phone in style.' },
  { title: 'Buy & Sell Old Phones', desc: 'Best price for your used phone, or grab a great deal.' },
];

export default function Home() {
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
      </section>

      <section className="bg-navy-50 py-14">
        <div className="max-w-7xl mx-auto px-4 grid gap-6 sm:grid-cols-3 text-center">
          <Link to="/products" className="bg-white rounded-xl p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-lg font-bold text-navy-800 mb-2">Browse Accessories</h3>
            <p className="text-sm text-navy-500">Covers, chargers, batteries, cables &amp; more.</p>
          </Link>
          <Link to="/secondhand" className="bg-white rounded-xl p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-lg font-bold text-navy-800 mb-2">Secondhand Phones</h3>
            <p className="text-sm text-navy-500">Quality checked, great prices.</p>
          </Link>
          <Link to="/repair" className="bg-white rounded-xl p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-lg font-bold text-navy-800 mb-2">Book a Repair</h3>
            <p className="text-sm text-navy-500">Quick turnaround, fair pricing.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
