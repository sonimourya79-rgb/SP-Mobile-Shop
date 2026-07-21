const ITEMS = [
  {
    label: 'Screen Repair',
    gradient: 'linear-gradient(135deg,#1f317c,#4f68c2)',
    delay: '0s',
    tilt: '-6deg',
    icon: (
      <>
        <rect x="70" y="20" width="100" height="200" rx="18" fill="none" stroke="#fff" strokeWidth="8" />
        <rect x="85" y="40" width="70" height="130" rx="6" fill="#fff" fillOpacity="0.25" />
        <polygon points="70,145 170,55 170,90 70,180" fill="#fff" fillOpacity="0.4" />
      </>
    ),
  },
  {
    label: 'Battery',
    gradient: 'linear-gradient(135deg,#16235d,#2e469f)',
    delay: '0.6s',
    tilt: '5deg',
    icon: (
      <>
        <rect x="55" y="75" width="135" height="70" rx="10" fill="none" stroke="#fff" strokeWidth="8" />
        <rect x="192" y="95" width="14" height="30" rx="4" fill="#fff" />
        <rect x="67" y="87" width="75" height="46" fill="#fff" fillOpacity="0.9" />
      </>
    ),
  },
  {
    label: 'Fast Charging',
    gradient: 'linear-gradient(135deg,#e08e10,#f4c15c)',
    delay: '1.2s',
    tilt: '-4deg',
    icon: (
      <>
        <rect x="90" y="34" width="60" height="86" rx="10" fill="#fff" />
        <rect x="105" y="10" width="10" height="30" fill="#fff" />
        <rect x="135" y="10" width="10" height="30" fill="#fff" />
        <path d="M120 120 L120 155 Q120 175 100 185 L78 208" stroke="#fff" strokeWidth="9" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: 'Bluetooth Earbuds',
    gradient: 'linear-gradient(135deg,#1e3a8a,#3b82f6)',
    delay: '0.3s',
    tilt: '6deg',
    icon: (
      <>
        <rect x="65" y="70" width="110" height="90" rx="20" fill="none" stroke="#fff" strokeWidth="8" />
        <line x1="65" y1="105" x2="175" y2="105" stroke="#fff" strokeWidth="6" />
        <circle cx="100" cy="135" r="14" fill="#fff" />
        <circle cx="140" cy="135" r="14" fill="#fff" />
      </>
    ),
  },
  {
    label: 'Back Covers',
    gradient: 'linear-gradient(135deg,#2e469f,#7e91da)',
    delay: '0.9s',
    tilt: '-5deg',
    icon: (
      <>
        <rect x="65" y="15" width="110" height="210" rx="22" fill="none" stroke="#fff" strokeWidth="8" />
        <circle cx="120" cy="45" r="10" fill="#fff" fillOpacity="0.7" />
        <rect x="80" y="70" width="80" height="130" rx="8" fill="#fff" fillOpacity="0.15" />
      </>
    ),
  },
  {
    label: 'Neckband BT',
    gradient: 'linear-gradient(135deg,#0f766e,#14b8a6)',
    delay: '1.5s',
    tilt: '4deg',
    icon: (
      <>
        <path d="M50 40 Q30 130 70 190" stroke="#fff" strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d="M190 40 Q210 130 170 190" stroke="#fff" strokeWidth="14" fill="none" strokeLinecap="round" />
        <circle cx="65" cy="196" r="14" fill="#fff" />
        <circle cx="175" cy="196" r="14" fill="#fff" />
      </>
    ),
  },
];

export default function FloatingAccessoryIcons() {
  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
      {ITEMS.map((item) => (
        <div
          key={item.label}
          className="animate-float flex flex-col items-center gap-2"
          style={{ animationDelay: item.delay, '--tilt': item.tilt }}
        >
          <div
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl shadow-lg shadow-black/30 flex items-center justify-center ring-1 ring-white/10"
            style={{ backgroundImage: item.gradient }}
          >
            <svg viewBox="0 0 240 240" className="h-9 w-9 sm:h-11 sm:w-11">
              {item.icon}
            </svg>
          </div>
          <span className="text-xs text-navy-100/90 font-medium text-center">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
