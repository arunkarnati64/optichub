'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
  recentOrders: {
    _id: string;
    total: number;
    status: string;
    createdAt: string;
    items: { name: string }[];
  }[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.get('/orders'),
          api.get('/products?limit=1000'),
        ]);

        const orders = ordersRes.data;
        const products = productsRes.data.products;

        const totalRevenue = orders
          .filter((o: any) => o.status !== 'cancelled')
          .reduce((sum: number, o: any) => sum + o.total, 0);

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalProducts: products.length,
          pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
          recentOrders: orders.slice(0, 5),
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 animate-pulse space-y-6">
        <div className="grid grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-100 rounded-2xl" />)}
        </div>
        <div className="h-64 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Revenue', value: `$${stats?.totalRevenue.toFixed(2)}`, icon: '💰', color: 'bg-green-50 text-green-700' },
          { label: 'Total Orders', value: stats?.totalOrders, icon: '📦', color: 'bg-blue-50 text-blue-700' },
          { label: 'Pending Orders', value: stats?.pendingOrders, icon: '⏳', color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Total Products', value: stats?.totalProducts, icon: '🕶️', color: 'bg-purple-50 text-purple-700' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-100 rounded-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-amber-600 hover:underline">View all →</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {stats?.recentOrders.length === 0 && (
            <p className="text-center text-gray-400 py-8 text-sm">No orders yet</p>
          )}
          {stats?.recentOrders.map((order) => (
            <div key={order._id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                  {order.items.map((i) => i.name).join(', ')}
                </p>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 text-sm">${order.total.toFixed(2)}</p>
                <span className={`mt-1 inline-block capitalize text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
