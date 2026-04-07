'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import StarRating from '@/components/StarRating';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden bg-gray-50 aspect-[4/3]">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-5xl">🕶️</div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {discount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Feature icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {product.uvProtection && (
            <span title="UV Protection" className="bg-white text-xs px-2 py-0.5 rounded-full shadow text-blue-600 font-medium">UV400</span>
          )}
          {product.blueLightFilter && (
            <span title="Blue Light Filter" className="bg-white text-xs px-2 py-0.5 rounded-full shadow text-indigo-600 font-medium">BLF</span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">{product.brand}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug hover:text-amber-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        {(product.reviewCount ?? 0) > 0 && (
          <div className="mt-1">
            <StarRating rating={product.avgRating ?? 0} size="sm" count={product.reviewCount} />
          </div>
        )}

        {/* Tags */}
        <div className="flex gap-1 mt-2 flex-wrap">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{product.frameType}</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{product.shape}</span>
          {product.prescriptionSupported && (
            <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">Rx Ready</span>
          )}
        </div>

        {/* Colors */}
        {product.frameColor.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {product.frameColor.slice(0, 4).map((color) => (
              <span
                key={color}
                className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full capitalize"
              >
                {color}
              </span>
            ))}
          </div>
        )}

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.comparePrice && (
              <span className="ml-2 text-sm text-gray-400 line-through">${product.comparePrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={() => addItem(product, 1)}
            disabled={product.stock === 0}
            className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? 'Sold Out' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
