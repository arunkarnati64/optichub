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
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for aviators, blue light glasses, titanium frames…"
          className="w-full rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 px-6 py-3.5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 backdrop-blur-sm"
        />
        <button
          type="submit"
          className="absolute right-2 bg-amber-500 hover:bg-amber-400 transition-colors rounded-full p-2.5"
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
