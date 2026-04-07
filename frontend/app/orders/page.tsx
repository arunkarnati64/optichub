'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

interface Order {
  _id: string;
  items: { name: string; quantity: number }[];
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-lg font-medium">No orders yet</p>
          <Link href="/products" className="mt-4 inline-block text-amber-600 hover:underline text-sm">Start shopping →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow"
            >
              <div>
                <p className="font-semibold text-gray-900 text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                  {order.items.map((i) => i.name).join(', ')}
                </p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                <span className={`mt-1 inline-block capitalize text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                  {order.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
