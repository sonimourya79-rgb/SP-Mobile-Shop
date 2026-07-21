const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const uploadDir = path.join(__dirname, '..', 'uploads');

const CATEGORY_ICONS = {
  'Tempered Glass': `
    <rect x="70" y="20" width="100" height="200" rx="18" fill="none" stroke="#ffffff" stroke-width="8"/>
    <rect x="85" y="40" width="70" height="130" rx="6" fill="#ffffff" fill-opacity="0.25"/>
    <polygon points="70,145 170,55 170,90 70,180" fill="#ffffff" fill-opacity="0.4"/>`,
  'Back Cover': `
    <rect x="65" y="15" width="110" height="210" rx="22" fill="none" stroke="#ffffff" stroke-width="8"/>
    <circle cx="120" cy="45" r="10" fill="#ffffff" fill-opacity="0.65"/>
    <rect x="80" y="70" width="80" height="130" rx="8" fill="#ffffff" fill-opacity="0.15"/>`,
  Charger: `
    <rect x="90" y="34" width="60" height="86" rx="10" fill="#ffffff"/>
    <rect x="105" y="10" width="10" height="30" fill="#ffffff"/>
    <rect x="135" y="10" width="10" height="30" fill="#ffffff"/>
    <path d="M120 120 L120 155 Q120 175 100 185 L78 208" stroke="#ffffff" stroke-width="9" fill="none" stroke-linecap="round"/>`,
  'Charging Cable': `
    <path d="M35 205 Q100 100 120 120 Q140 140 205 35" stroke="#ffffff" stroke-width="10" fill="none" stroke-linecap="round"/>
    <rect x="15" y="188" width="36" height="36" rx="9" fill="#ffffff"/>
    <rect x="189" y="16" width="36" height="36" rx="9" fill="#ffffff"/>`,
  'Power Bank': `
    <rect x="60" y="50" width="120" height="150" rx="16" fill="none" stroke="#ffffff" stroke-width="8"/>
    <rect x="100" y="28" width="40" height="22" rx="6" fill="#ffffff"/>
    <polygon points="132,88 100,142 118,142 108,182 150,120 130,120" fill="#ffffff"/>`,
  Battery: `
    <rect x="55" y="75" width="135" height="70" rx="10" fill="none" stroke="#ffffff" stroke-width="8"/>
    <rect x="192" y="95" width="14" height="30" rx="4" fill="#ffffff"/>
    <rect x="67" y="87" width="75" height="46" fill="#ffffff" fill-opacity="0.9"/>`,
  'Wired Earphones': `
    <circle cx="60" cy="70" r="22" fill="none" stroke="#ffffff" stroke-width="8"/>
    <circle cx="180" cy="70" r="22" fill="none" stroke="#ffffff" stroke-width="8"/>
    <path d="M60 92 Q60 150 120 160 Q180 150 180 92" stroke="#ffffff" stroke-width="8" fill="none"/>
    <path d="M120 160 L120 210" stroke="#ffffff" stroke-width="8" fill="none"/>`,
  'Neckband Bluetooth': `
    <path d="M50 40 Q30 130 70 190" stroke="#ffffff" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M190 40 Q210 130 170 190" stroke="#ffffff" stroke-width="14" fill="none" stroke-linecap="round"/>
    <circle cx="65" cy="196" r="14" fill="#ffffff"/>
    <circle cx="175" cy="196" r="14" fill="#ffffff"/>`,
  'Bluetooth Earbuds': `
    <rect x="65" y="70" width="110" height="90" rx="20" fill="none" stroke="#ffffff" stroke-width="8"/>
    <line x1="65" y1="105" x2="175" y2="105" stroke="#ffffff" stroke-width="6"/>
    <circle cx="100" cy="135" r="14" fill="#ffffff"/>
    <circle cx="140" cy="135" r="14" fill="#ffffff"/>`,
  'Bluetooth Speaker': `
    <circle cx="120" cy="120" r="28" fill="#ffffff"/>
    <circle cx="120" cy="120" r="55" fill="none" stroke="#ffffff" stroke-width="6" stroke-opacity="0.6"/>
    <circle cx="120" cy="120" r="82" fill="none" stroke="#ffffff" stroke-width="6" stroke-opacity="0.32"/>`,
  'Mobile Holder': `
    <rect x="40" y="184" width="160" height="16" rx="8" fill="#ffffff"/>
    <path d="M62 184 L100 92 L138 184 Z" fill="none" stroke="#ffffff" stroke-width="8" stroke-linejoin="round"/>
    <rect x="150" y="58" width="50" height="92" rx="8" fill="#ffffff" fill-opacity="0.9"/>`,
  'OTG & Adapters': `
    <rect x="70" y="90" width="100" height="50" rx="8" fill="#ffffff"/>
    <rect x="50" y="105" width="20" height="20" fill="#ffffff"/>
    <rect x="170" y="100" width="16" height="10" fill="#ffffff"/>
    <rect x="170" y="120" width="16" height="10" fill="#ffffff"/>`,
  Other: `
    <rect x="40" y="184" width="160" height="16" rx="8" fill="#ffffff"/>
    <path d="M62 184 L100 92 L138 184 Z" fill="none" stroke="#ffffff" stroke-width="8" stroke-linejoin="round"/>
    <rect x="150" y="58" width="50" height="92" rx="8" fill="#ffffff" fill-opacity="0.9"/>`,
};

const CATEGORY_GRADIENTS = {
  'Tempered Glass': ['#1f317c', '#4f68c2'],
  'Back Cover': ['#2e469f', '#7e91da'],
  Charger: ['#e08e10', '#f4c15c'],
  'Charging Cable': ['#8f570b', '#f4a623'],
  'Power Bank': ['#0e7490', '#22d3ee'],
  Battery: ['#16235d', '#2e469f'],
  'Wired Earphones': ['#5b21b6', '#8b5cf6'],
  'Neckband Bluetooth': ['#0f766e', '#14b8a6'],
  'Bluetooth Earbuds': ['#1e3a8a', '#3b82f6'],
  'Bluetooth Speaker': ['#0e1740', '#7e91da'],
  'Mobile Holder': ['#7c2d12', '#f97316'],
  'OTG & Adapters': ['#b45309', '#f59e0b'],
  Other: ['#334155', '#64748b'],
};

const BRAND_GRADIENTS = {
  Samsung: ['#0b3d91', '#1e6fd9'],
  Apple: ['#1c1c1e', '#48484a'],
  OnePlus: ['#b30021', '#7a0019'],
  Xiaomi: ['#ff6900', '#cc5500'],
  Realme: ['#2f9e44', '#0ca678'],
  Vivo: ['#4c6ef5', '#364fc7'],
};

const PHONE_ICON = `
  <rect x="70" y="18" width="100" height="204" rx="20" fill="#0e1740"/>
  <rect x="80" y="34" width="80" height="162" rx="4" fill="#ffffff" fill-opacity="0.92"/>
  <rect x="104" y="24" width="32" height="6" rx="3" fill="#0e1740"/>
  <circle cx="120" cy="209" r="6" fill="#0e1740"/>`;

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars) {
      lines.push(current.trim());
      current = word;
    } else {
      current = (current + ' ' + word).trim();
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 2);
}

function buildSvg({ title, subtitleLines, from, to, icon }) {
  const safeTitle = escapeXml(title);
  const subtitleSvg = subtitleLines
    .map((line, i) => `<text x="400" y="${535 + i * 42}" font-size="30" fill="#ffffff" fill-opacity="0.85" text-anchor="middle" font-family="Arial, sans-serif">${escapeXml(line)}</text>`)
    .join('');

  return `
    <svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${from}"/>
          <stop offset="1" stop-color="${to}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#g)"/>
      <circle cx="120" cy="680" r="140" fill="#ffffff" fill-opacity="0.05"/>
      <circle cx="700" cy="120" r="180" fill="#ffffff" fill-opacity="0.05"/>
      <g transform="translate(244,70) scale(1.3)">${icon}</g>
      <text x="400" y="450" font-size="44" font-weight="700" fill="#ffffff" text-anchor="middle" font-family="Arial, sans-serif">${safeTitle}</text>
      ${subtitleSvg}
      <text x="764" y="764" font-size="20" fill="#ffffff" fill-opacity="0.55" text-anchor="end" font-family="Arial, sans-serif">SP Mobile</text>
    </svg>`;
}

async function renderToUploads(svg, filename) {
  const filePath = path.join(uploadDir, filename);
  if (!fs.existsSync(filePath)) {
    await sharp(Buffer.from(svg)).png().toFile(filePath);
  }
  return `/uploads/${filename}`;
}

async function productImage(product) {
  const [from, to] = CATEGORY_GRADIENTS[product.category] || CATEGORY_GRADIENTS.Other;
  const icon = CATEGORY_ICONS[product.category] || CATEGORY_ICONS.Other;
  const svg = buildSvg({
    title: product.category.toUpperCase(),
    subtitleLines: wrapText(product.name, 26),
    from,
    to,
    icon,
  });
  const filename = `seed-product-${slugify(product.name)}.png`;
  return renderToUploads(svg, filename);
}

async function phoneImage(phone) {
  const [from, to] = BRAND_GRADIENTS[phone.brand] || CATEGORY_GRADIENTS.Other;
  const svg = buildSvg({
    title: phone.brand.toUpperCase(),
    subtitleLines: wrapText(phone.model, 22),
    from,
    to,
    icon: PHONE_ICON,
  });
  const filename = `seed-phone-${slugify(phone.brand)}-${slugify(phone.model)}.png`;
  return renderToUploads(svg, filename);
}

async function attachProductImages(products) {
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  for (const p of products) {
    p.images = [await productImage(p)];
  }
  return products;
}

async function attachPhoneImages(phones) {
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  for (const p of phones) {
    p.images = [await phoneImage(p)];
  }
  return phones;
}

module.exports = { attachProductImages, attachPhoneImages };
