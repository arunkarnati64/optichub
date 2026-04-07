'use client';

import { useRouter } from 'next/navigation';
import { Category } from '@/types';

interface Props {
  categories: Category[];
  currentParams: Record<string, string | undefined>;
}

const frameTypes = ['full-rim', 'half-rim', 'rimless', 'supra'];
const shapes = ['aviator', 'round', 'square', 'rectangle', 'cat-eye', 'oval', 'wayfarer', 'geometric'];
const genders = ['men', 'women', 'unisex', 'kids'];
const lensTypes = ['clear', 'tinted', 'polarized', 'photochromic', 'mirrored'];
const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Featured', value: 'featured' },
];

export default function FilterSidebar({ categories, currentParams }: Props) {
  const router = useRouter();

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams();
    // carry all current params except the one being updated and reset page
    Object.entries(currentParams).forEach(([k, v]) => {
      if (v && k !== key && k !== 'page') params.set(k, v);
    });
    if (value) params.set(key, value);
    router.push(`/products?${params.toString()}`);
  };

  const toggleBoolean = (key: string) => {
    const current = currentParams[key];
    updateFilter(key, current === 'true' ? undefined : 'true');
  };

  const clearAll = () => router.push('/products');

  const hasFilters = Object.entries(currentParams).some(([k, v]) => v && k !== 'page');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900">Filters</h2>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-amber-600 hover:underline">
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
        <input
          type="text"
          defaultValue={currentParams.search ?? ''}
          placeholder="Brand, name..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') updateFilter('search', (e.target as HTMLInputElement).value || undefined);
          }}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
        <select
          value={currentParams.sort ?? 'newest'}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter('category', undefined)}
            className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${!currentParams.category ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateFilter('category', cat.slug)}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${currentParams.category === cat.slug ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
        <div className="flex flex-wrap gap-2">
          {genders.map((g) => (
            <button
              key={g}
              onClick={() => updateFilter('gender', currentParams.gender === g ? undefined : g)}
              className={`capitalize text-xs px-3 py-1.5 rounded-full border transition-colors ${currentParams.gender === g ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Frame Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Frame Type</label>
        <div className="flex flex-wrap gap-2">
          {frameTypes.map((f) => (
            <button
              key={f}
              onClick={() => updateFilter('frameType', currentParams.frameType === f ? undefined : f)}
              className={`capitalize text-xs px-3 py-1.5 rounded-full border transition-colors ${currentParams.frameType === f ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Shape */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Shape</label>
        <div className="flex flex-wrap gap-2">
          {shapes.map((s) => (
            <button
              key={s}
              onClick={() => updateFilter('shape', currentParams.shape === s ? undefined : s)}
              className={`capitalize text-xs px-3 py-1.5 rounded-full border transition-colors ${currentParams.shape === s ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Lens Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Lens Type</label>
        <div className="flex flex-wrap gap-2">
          {lensTypes.map((l) => (
            <button
              key={l}
              onClick={() => updateFilter('lensType', currentParams.lensType === l ? undefined : l)}
              className={`capitalize text-xs px-3 py-1.5 rounded-full border transition-colors ${currentParams.lensType === l ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={currentParams.minPrice ?? ''}
            onBlur={(e) => updateFilter('minPrice', e.target.value || undefined)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={currentParams.maxPrice ?? ''}
            onBlur={(e) => updateFilter('maxPrice', e.target.value || undefined)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Feature Toggles */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Features</label>
        <div className="space-y-2">
          {[
            { key: 'blueLightFilter', label: '🔵 Blue Light Filter' },
            { key: 'prescriptionSupported', label: '👓 Prescription Ready' },
            { key: 'uvProtection', label: '☀️ UV Protection' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggleBoolean(key)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg border transition-colors ${currentParams[key] === 'true' ? 'bg-amber-50 border-amber-400 text-amber-800 font-medium' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
