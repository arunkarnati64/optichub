'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import Link from 'next/link';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// ── Address Form ──────────────────────────────────────────────────────────────

interface Address {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface AddressStepProps {
  onNext: (address: Address, clientSecret: string, orderId: string) => void;
}

function AddressStep({ onNext }: AddressStepProps) {
  const { items } = useCartStore();
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
      onNext(form, data.clientSecret, data.order._id);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 5.99;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl">{error}</div>}

      <div className="grid grid-cols-1 gap-4">
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
      </div>

      {/* Order summary mini */}
      <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
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
        {loading ? 'Processing...' : 'Continue to Payment'}
      </button>
    </form>
  );
}

// ── Payment Form ──────────────────────────────────────────────────────────────

function PaymentForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError('');
    setLoading(true);

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: `${window.location.origin}/orders/${orderId}?success=true`,
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? 'Payment failed');
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      clearCart();
      router.push(`/orders/${orderId}?success=true`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl">{error}</div>}
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded-full bg-gray-900 py-3 text-white font-semibold hover:bg-amber-500 transition-colors disabled:opacity-50"
      >
        {loading ? 'Processing payment...' : 'Pay Now'}
      </button>
      <p className="text-xs text-center text-gray-400">
        🔒 Secured by Stripe. Test card: 4242 4242 4242 4242
      </p>
    </form>
  );
}

// ── Checkout Page ─────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, total } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState('');

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

  const handleAddressNext = (address: any, secret: string, oid: string) => {
    setClientSecret(secret);
    setOrderId(oid);
    setStep('payment');
  };

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-12">
      {/* Steps */}
      <div className="flex items-center gap-3 mb-10">
        <div className={`flex items-center gap-2 text-sm font-semibold ${step === 'address' ? 'text-gray-900' : 'text-green-600'}`}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 'address' ? 'bg-gray-900 text-white' : 'bg-green-100 text-green-600'}`}>
            {step === 'payment' ? '✓' : '1'}
          </span>
          Shipping
        </div>
        <div className="flex-1 h-px bg-gray-200" />
        <div className={`flex items-center gap-2 text-sm font-semibold ${step === 'payment' ? 'text-gray-900' : 'text-gray-400'}`}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 'payment' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
            2
          </span>
          Payment
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        {step === 'address' && <AddressStep onNext={handleAddressNext} />}
        {step === 'payment' && clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance: { theme: 'stripe' } }}
          >
            <PaymentForm orderId={orderId} />
          </Elements>
        )}
      </div>
    </div>
  );
}
