const ITEMS = [
  {
    key: 'call',
    label: 'Call Us',
    sub: '9653206528',
    href: 'tel:9653206528',
    bg: 'bg-navy-800',
    path: 'M3 5a2 2 0 012-2h2.28a1 1 0 01.98.804l.803 4.011a1 1 0 01-.564 1.11L6.6 9.6a11.04 11.04 0 005.8 5.8l.696-1.897a1 1 0 011.11-.564l4.011.803a1 1 0 01.804.98V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    sub: 'Chat with us',
    href: 'https://wa.me/919653206528?text=Hi%2C%20I%20have%20a%20query%20about%20SP%20Mobile.',
    external: true,
    bg: 'bg-green-500',
    path: 'M21 11.5a8.5 8.5 0 01-12.36 7.56L3 20l1.05-5.4A8.5 8.5 0 1121 11.5zM8.5 9.5c0 3.5 2.5 6 6 6l1-2-2.2-1-.8 1a5 5 0 01-3-3l1-.8-1-2.2-2 1z',
  },
  {
    key: 'email',
    label: 'Email Us',
    sub: 'spmobiletechnology@gmail.com',
    href: 'mailto:spmobiletechnology@gmail.com',
    bg: 'bg-gold-500',
    path: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    key: 'location',
    label: 'Locate Us',
    sub: 'Malad East, Mumbai',
    href: 'https://maps.app.goo.gl/qZqxhzqyMeV4A39Z8',
    external: true,
    bg: 'bg-red-500',
    path: 'M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
  },
];

export default function QuickContactBar() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      <h2 className="text-2xl font-bold text-navy-900 mb-2 text-center">Get in Touch, Instantly</h2>
      <p className="text-navy-500 text-center mb-8">Tap any option below — no forms, no waiting.</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {ITEMS.map((item) => (
          <a
            key={item.key}
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noreferrer' : undefined}
            className="group bg-white border border-navy-100 rounded-xl p-5 flex flex-col items-center text-center gap-2 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gold-300"
          >
            <span className={`h-12 w-12 rounded-full ${item.bg} text-white flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.path} />
              </svg>
            </span>
            <span className="font-semibold text-navy-900 text-sm">{item.label}</span>
            <span className="text-xs text-navy-400 truncate max-w-full">{item.sub}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
