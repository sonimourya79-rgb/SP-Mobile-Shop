import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'sp_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(product, itemType) {
    setItems((prev) => {
      const existing = prev.find((i) => i.itemId === product._id);
      if (existing) {
        return prev.map((i) =>
          i.itemId === product._id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          itemId: product._id,
          itemType,
          name: itemType === 'SecondhandPhone' ? `${product.brand} ${product.model}` : product.name,
          price: product.price,
          image: product.images?.[0] || null,
          qty: 1,
        },
      ];
    });
  }

  function updateQty(itemId, qty) {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (i.itemId === itemId ? { ...i, qty } : i)));
  }

  function removeItem(itemId) {
    setItems((prev) => prev.filter((i) => i.itemId !== itemId));
  }

  function clearCart() {
    setItems([]);
  }

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQty, removeItem, clearCart, totalAmount, totalCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
