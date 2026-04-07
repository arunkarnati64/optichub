'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Quantity selector */}
      <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors text-lg"
        >
          −
        </button>
        <span className="px-4 py-2 text-sm font-bold min-w-[2rem] text-center">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors text-lg"
        >
          +
        </button>
      </div>

      {/* Add to cart */}
      <button
        onClick={handleAdd}
        disabled={product.stock === 0}
        className={`flex-1 rounded-full py-3 px-8 font-semibold text-sm transition-all ${
          added
            ? 'bg-green-500 text-white'
            : product.stock === 0
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gray-900 text-white hover:bg-amber-500'
        }`}
      >
        {product.stock === 0 ? 'Out of Stock' : added ? '✓ Added to Cart' : 'Add to Cart'}
      </button>
    </div>
  );
}
