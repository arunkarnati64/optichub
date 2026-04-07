'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products?limit=100');
      setProducts(data.products);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    setDeleting(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 animate-pulse space-y-4">
        {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} eyewear products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-400 transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <div className="col-span-5">Product</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-1">Stock</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Actions</div>
        </div>

        <div className="divide-y divide-gray-50">
          {products.map((product) => (
            <div key={product._id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
              {/* Product info */}
              <div className="col-span-5 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                  {product.images[0] ? (
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="48px" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xl">🕶️</div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-amber-600">{product.brand}</p>
                  <div className="flex gap-1 mt-0.5">
                    {product.featured && (
                      <span className="text-xs bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full">Featured</span>
                    )}
                    <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full capitalize">{product.shape}</span>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="col-span-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                  {product.category?.name ?? '—'}
                </span>
              </div>

              {/* Stock */}
              <div className="col-span-1">
                <span className={`text-sm font-semibold ${product.stock === 0 ? 'text-red-500' : product.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {product.stock}
                </span>
              </div>

              {/* Price */}
              <div className="col-span-2">
                <p className="font-bold text-gray-900 text-sm">${product.price.toFixed(2)}</p>
                {product.comparePrice && (
                  <p className="text-xs text-gray-400 line-through">${product.comparePrice.toFixed(2)}</p>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-2 flex gap-2">
                <Link
                  href={`/admin/products/${product._id}/edit`}
                  className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product._id, product.name)}
                  disabled={deleting === product._id}
                  className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-40"
                >
                  {deleting === product._id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
