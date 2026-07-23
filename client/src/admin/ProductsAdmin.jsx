import { useState } from 'react';
import ProductCatalogTab from './ProductCatalogTab';
import PurchaseTab from './PurchaseTab';
import SaleTab from './SaleTab';

const TABS = [
  { key: 'catalog', label: 'Catalog' },
  { key: 'purchase', label: 'Purchase Entry' },
  { key: 'sale', label: 'Sale Entry' },
];

export default function ProductsAdmin() {
  const [tab, setTab] = useState('catalog');

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-900 mb-4">Accessories</h1>
      <div className="flex gap-2 border-b border-navy-100 mb-6 overflow-x-auto scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`shrink-0 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.key ? 'border-gold-400 text-navy-900' : 'border-transparent text-navy-400 hover:text-navy-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'catalog' && <ProductCatalogTab />}
      {tab === 'purchase' && <PurchaseTab />}
      {tab === 'sale' && <SaleTab />}
    </div>
  );
}
