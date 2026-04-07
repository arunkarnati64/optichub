'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import Link from 'next/link';

interface Address {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Address>({
    fullName: user?.name ?? '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const set = (key: keyof Address) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link href="/products" className="text-amber-600 hover:underline">Browse frames</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <p className="text-gray-500 mb-4">Please log in to checkout.</p>
        <Link href="/login" className="rounded-full bg-gray-900 px-6 py-2 text-white font-semibold hover:bg-amber-500 transition-colors">
          Login
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 5.99;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cartItems = items.map(({ product, quantity }) => ({
        productId: product._id,
        quantity,
      }));
      const { data } = await api.post('/payments/create-order', {
        cartItems,
        shippingAddress: form,
      });

      // Clear cart and redirect to Stripe Checkout
      clearCart();
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to create order');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-500 text-sm mt-1">Enter your shipping details, then pay securely via Stripe.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input required value={form.fullName} onChange={set('fullName')}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input required value={form.address} onChange={set('address')}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input required value={form.city} onChange={set('city')}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input required value={form.state} onChange={set('state')}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
            <input required value={form.zipCode} onChange={set('zipCode')}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select value={form.country} onChange={set('country')}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="IN">India</option>
            </select>
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2 mt-4">
          {items.map(({ product, quantity }) => (
            <div key={product._id} className="flex justify-between text-gray-600">
              <span>{product.name} x{quantity}</span>
              <span>${(product.price * quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-2 flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-200">
            <span>Total</span><span>${(subtotal + shipping).toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-gray-900 py-3 text-white font-semibold hover:bg-amber-500 transition-colors disabled:opacity-50"
        >
          {loading ? 'Redirecting to payment...' : 'Proceed to Payment'}
        </button>
        <p className="text-xs text-center text-gray-400">
          You'll be redirected to Stripe's secure payment page.
        </p>
      </form>
    </div>
  );
}
