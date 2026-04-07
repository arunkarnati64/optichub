'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/products?search=${encodeURIComponent(q)}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mb-8">
      <div className="relative flex items-center">
        <svg className="absolute left-4 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search aviators, blue light, titanium..."
          className="w-full rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-500 pl-12 pr-28 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 backdrop-blur-sm transition-all"
        />
        <button
          type="submit"
          className="absolute right-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg hover:shadow-amber-500/25 transition-all rounded-full px-5 py-2 text-sm font-medium text-white"
        >
          Search
        </button>
      </div>
    </form>
  );
}
