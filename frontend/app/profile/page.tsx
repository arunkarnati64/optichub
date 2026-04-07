'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
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

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuthStore();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  // Account form
  const [name, setName] = useState('');
  const [accountMsg, setAccountMsg] = useState('');
  const [accountError, setAccountError] = useState('');
  const [accountLoading, setAccountLoading] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) { router.push('/login'); return; }
    setName(user.name);
    api.get('/orders/my')
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, [hydrated, user]);

  if (!hydrated || !user) return null;

  const handleAccountSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountMsg('');
    setAccountError('');
    if (!name.trim()) { setAccountError('Name cannot be empty'); return; }
    setAccountLoading(true);
    try {
      await updateProfile({ name: name.trim() });
      setAccountMsg('Name updated successfully');
    } catch (err: any) {
      setAccountError(err?.response?.data?.message ?? 'Failed to update');
    } finally {
      setAccountLoading(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match'); return; }
    if (newPassword.length < 6) { setPasswordError('Password must be at least 6 characters'); return; }
    setPasswordLoading(true);
    try {
      await updateProfile({ currentPassword, newPassword });
      setPasswordMsg('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err?.response?.data?.message ?? 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-500 mt-1">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Sign out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: account settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Avatar */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-3xl font-bold text-amber-600 mb-3">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <span className="mt-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 capitalize">
              {user.role}
            </span>
          </div>

          {/* Update name */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Account Info</h2>
            <form onSubmit={handleAccountSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full border border-gray-100 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>
              {accountMsg && <p className="text-xs text-green-600">{accountMsg}</p>}
              {accountError && <p className="text-xs text-red-500">{accountError}</p>}
              <button
                type="submit"
                disabled={accountLoading}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
              >
                {accountLoading ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Change password */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Change Password</h2>
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              {passwordMsg && <p className="text-xs text-green-600">{passwordMsg}</p>}
              {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
              >
                {passwordLoading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Right column: order history */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-900">Order History</h2>
              <Link href="/orders" className="text-xs text-amber-600 hover:underline">
                View all →
              </Link>
            </div>

            {ordersLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-3">📦</div>
                <p className="font-medium">No orders yet</p>
                <Link href="/products" className="mt-3 inline-block text-amber-600 hover:underline text-sm">
                  Start shopping →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 10).map((order) => (
                  <Link
                    key={order._id}
                    href={`/orders/${order._id}`}
                    className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''} ·{' '}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="font-bold text-gray-900 text-sm">${order.total.toFixed(2)}</p>
                      <span
                        className={`mt-1 inline-block capitalize text-xs font-semibold px-2 py-0.5 rounded-full ${
                          statusColors[order.status] ?? 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
