'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

interface Order {
  _id: string;
  items: { name: string; image: string; price: number; quantity: number }[];
  shippingAddress: { fullName: string; address: string; city: string; state: string; zipCode: string; country: string };
  subtotal: number;
  shippingCost: number;
  total: number;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 animate-pulse space-y-4">
        <div className="h-8 bg-gray-100 rounded w-1/2" />
        <div className="h-40 bg-gray-100 rounded" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-gray-500">
        Order not found.{' '}
        <Link href="/orders" className="text-amber-600 hover:underline">View all orders</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      {/* Success banner */}
      {isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-lg font-bold text-green-800">Payment successful!</h2>
          <p className="text-green-700 text-sm mt-1">Your order has been placed. We'll get your frames shipped soon.</p>
        </div>
      )}

      {/* Order header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-sm text-gray-400 mt-1">#{order._id.slice(-8).toUpperCase()}</p>
          <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <span className={`capitalize text-sm font-semibold px-3 py-1.5 rounded-full ${statusColors[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
          {order.status}
        </span>
      </div>

      {/* Items */}
      <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-50 mb-6">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-2xl shrink-0">
              🕶️
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">{item.name}</p>
              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
            </div>
            <p className="font-bold text-gray-900 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Shipping address */}
      <div className="bg-gray-50 rounded-2xl p-5 mb-6">
        <h3 className="font-bold text-gray-900 text-sm mb-2">Shipping Address</h3>
        <p className="text-sm text-gray-600">{order.shippingAddress.fullName}</p>
        <p className="text-sm text-gray-600">{order.shippingAddress.address}</p>
        <p className="text-sm text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
        <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
      </div>

      {/* Totals */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-8 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{order.shippingCost === 0 ? <span className="text-green-600">Free</span> : `$${order.shippingCost.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
          <span>Total</span><span>${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/orders" className="flex-1 text-center rounded-full border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          All Orders
        </Link>
        <Link href="/products" className="flex-1 text-center rounded-full bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-amber-500 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
