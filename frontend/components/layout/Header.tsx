'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

export default function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartCount = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));
  const [query, setQuery] = useState(searchParams.get('search') ?? '');
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/products?search=${encodeURIComponent(q)}`);
    } else {
      router.push('/products');
    }
    setSearchOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🕶️</span>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Optic<span className="text-amber-500">Hub</span>
            </span>
          </Link>

          {/* Nav / Search (middle section) */}
          <div className="hidden md:flex flex-1 items-center justify-center mx-8">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="w-full max-w-sm flex items-center">
                <div className="relative w-full">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search frames, brands…"
                    className="w-full border border-gray-200 rounded-full px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    ✕
                  </button>
                </div>
              </form>
            ) : (
              <nav className="flex items-center gap-8">
                <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  All Frames
                </Link>
                <Link href="/products?category=sunglasses" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Sunglasses
                </Link>
                <Link href="/products?category=blue-light" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Blue Light
                </Link>
                <Link href="/products?category=prescription" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Prescription
                </Link>
              </nav>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Search icon */}
            {!searchOpen && (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            )}

            <Link href="/cart" className="relative text-gray-600 hover:text-gray-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/orders" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Orders
                </Link>
                <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Profile
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="rounded-full bg-gray-900 px-4 py-2 text-sm text-white hover:bg-amber-500 transition-colors">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
