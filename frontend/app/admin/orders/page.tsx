'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Order {
  _id: string;
  user: { name: string; email: string };
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: string;
  shippingAddress: { fullName: string; city: string; country: string };
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

const statusOptions = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => o._id === orderId ? { ...o, status } : o)
      );
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4 animate-pulse">
        {[1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <div className="text-5xl mb-4">📦</div>
          <p>No orders yet</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-6 gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <div className="col-span-2">Order</div>
            <div>Customer</div>
            <div>Total</div>
            <div>Status</div>
            <div>Update</div>
          </div>

          <div className="divide-y divide-gray-50">
            {orders.map((order) => (
              <div key={order._id}>
                <div
                  className="grid grid-cols-6 gap-4 px-6 py-4 items-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                >
                  {/* Order ID + date */}
                  <div className="col-span-2">
                    <p className="font-semibold text-sm text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                      {order.items.map(i => i.name).join(', ')}
                    </p>
                  </div>

                  {/* Customer */}
                  <div>
                    <p className="text-sm text-gray-700 font-medium">{order.user?.name ?? 'N/A'}</p>
                    <p className="text-xs text-gray-400">{order.shippingAddress?.city}</p>
                  </div>

                  {/* Total */}
                  <div className="font-bold text-gray-900 text-sm">${order.total.toFixed(2)}</div>

                  {/* Status badge */}
                  <div>
                    <span className={`capitalize text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Status update */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      disabled={updating === order._id}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50 w-full"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Expanded order details */}
                {expanded === order._id && (
                  <div className="px-6 pb-5 bg-gray-50 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-6 mt-4">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Items</p>
                        <div className="space-y-1">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-gray-700">{item.name} × {item.quantity}</span>
                              <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Ship to</p>
                        <p className="text-sm text-gray-700">{order.shippingAddress?.fullName}</p>
                        <p className="text-sm text-gray-500">{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                        {order.user?.email && (
                          <p className="text-sm text-gray-500 mt-1">{order.user.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
