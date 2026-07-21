import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h3 className="text-xl font-bold mb-2">
            <span className="text-gold-400">SP</span> Mobile
          </h3>
          <p className="text-sm text-navy-300">
            Shiv Shakti Blessings, Best Mobile Service. Accessories, repairing and secondhand phone
            buy &amp; sell — all under one roof.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/products" className="hover:text-gold-400">Accessories</Link></li>
            <li><Link to="/secondhand" className="hover:text-gold-400">Secondhand Phones</Link></li>
            <li><Link to="/repair" className="hover:text-gold-400">Book a Repair</Link></li>
            <li><Link to="/sell-phone" className="hover:text-gold-400">Sell Your Phone</Link></li>
            <li><Link to="/about" className="hover:text-gold-400">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-2">Contact Us</h4>
          <ul className="space-y-1 text-sm text-navy-300">
            <li>Mo.: <a href="tel:9653206528" className="hover:text-gold-400">9653206528</a></li>
            <li>Email: <a href="mailto:aa6871678@gmail.com" className="hover:text-gold-400">aa6871678@gmail.com</a></li>
            <li>Appapada, Malad East, Auto Stand Near 624 Bus Stop</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-800 text-center text-xs text-navy-400 py-4">
        &copy; {new Date().getFullYear()} SP Mobile. All rights reserved.
      </div>
    </footer>
  );
}
