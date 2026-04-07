import Link from 'next/link';
import api from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import HomeSearch from '@/components/HomeSearch';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data } = await api.get('/products/featured?limit=4');
    return data;
  } catch {
    return [];
  }
}

const shapes = [
  { label: 'Aviator', emoji: '🕶️', slug: 'aviator' },
  { label: 'Round', emoji: '⭕', slug: 'round' },
  { label: 'Square', emoji: '🔲', slug: 'square' },
  { label: 'Cat-Eye', emoji: '😺', slug: 'cat-eye' },
  { label: 'Wayfarer', emoji: '🎭', slug: 'wayfarer' },
  { label: 'Oval', emoji: '🥚', slug: 'oval' },
];

const categories = [
  { label: 'Sunglasses', slug: 'sunglasses', bg: 'bg-amber-50', text: 'text-amber-700' },
  { label: 'Blue Light', slug: 'blue-light', bg: 'bg-blue-50', text: 'text-blue-700' },
  { label: 'Prescription', slug: 'prescription', bg: 'bg-purple-50', text: 'text-purple-700' },
  { label: 'Reading', slug: 'reading', bg: 'bg-green-50', text: 'text-green-700' },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center">
          <span className="text-5xl mb-6">🕶️</span>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            See the world in <span className="text-amber-400">style</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-xl mb-10">
            Premium eyewear for every face shape, every lifestyle. Free shipping on orders over $50.
          </p>
          <HomeSearch />
          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              href="/products"
              className="rounded-full bg-amber-500 px-8 py-3 text-sm font-semibold text-white hover:bg-amber-400 transition-colors"
            >
              Shop All Frames
            </Link>
            <Link
              href="/products?featured=true"
              className="rounded-full border border-white px-8 py-3 text-sm font-semibold text-white hover:bg-white hover:text-gray-900 transition-colors"
            >
              Featured Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className={`${cat.bg} ${cat.text} rounded-2xl p-6 text-center font-semibold hover:opacity-80 transition-opacity`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Shop by Shape */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Shop by Shape</h2>
          <p className="text-gray-500 text-center mb-8">Find the perfect frame for your face shape</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {shapes.map((shape) => (
              <Link
                key={shape.slug}
                href={`/products?shape=${shape.slug}`}
                className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 hover:shadow-md transition-shadow"
              >
                <span className="text-3xl">{shape.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{shape.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Frames</h2>
            <Link href="/products?featured=true" className="text-sm text-amber-600 hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Features strip */}
      <section className="border-t border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
              { icon: '🔒', title: 'Secure Payment', desc: 'Stripe encrypted' },
              { icon: '🎧', title: '24/7 Support', desc: 'We\'re here to help' },
            ].map((f) => (
              <div key={f.title}>
                <div className="text-3xl mb-2">{f.icon}</div>
                <div className="font-semibold text-gray-900 text-sm">{f.title}</div>
                <div className="text-gray-500 text-xs mt-1">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
