'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const subtotal = total();
  const shippingCost = subtotal >= 50 ? 0 : 5.99;
  const orderTotal = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="text-6xl mb-6">🕶️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added any frames yet.</p>
        <Link
          href="/products"
          className="inline-block rounded-full bg-gray-900 px-8 py-3 text-white font-semibold hover:bg-amber-500 transition-colors"
        >
          Shop All Frames
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product._id} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4">
              {/* Image */}
              <Link href={`/products/${product.slug}`} className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                {product.images[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-3xl">🕶️</div>
                )}
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-amber-600 font-semibold uppercase">{product.brand}</p>
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-semibold text-gray-900 text-sm hover:text-amber-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-gray-400 mt-0.5 capitalize">{product.frameType} · {product.shape}</p>

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product._id, quantity - 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-50 transition-colors"
                    >−</button>
                    <span className="px-3 py-1 text-sm font-bold">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product._id, quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-50 transition-colors"
                    >+</button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-900">${(product.price * quantity).toFixed(2)}</span>
                    <button
                      onClick={() => removeItem(product._id)}
                      className="text-gray-300 hover:text-red-400 transition-colors text-lg"
                    >✕</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} item{items.length > 1 ? 's' : ''})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? <span className="text-green-600 font-medium">Free</span> : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              {shippingCost > 0 && (
                <p className="text-xs text-gray-400">Add ${(50 - subtotal).toFixed(2)} more for free shipping</p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 block w-full text-center rounded-full bg-gray-900 py-3 text-white font-semibold hover:bg-amber-500 transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/products"
              className="mt-3 block w-full text-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
