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
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden bg-gray-50 aspect-[4/3]">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="w-16 h-16 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Feature icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {product.uvProtection && (
            <span className="bg-white/90 backdrop-blur-sm text-[10px] px-2 py-0.5 rounded-full shadow-sm text-blue-600 font-semibold">UV400</span>
          )}
          {product.blueLightFilter && (
            <span className="bg-white/90 backdrop-blur-sm text-[10px] px-2 py-0.5 rounded-full shadow-sm text-indigo-600 font-semibold">BLF</span>
          )}
        </div>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white rounded-full px-5 py-2 text-xs font-semibold text-gray-900 shadow-lg translate-y-2 group-hover:translate-y-0">
            View Details
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 sm:p-5">
        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mb-1.5">{product.brand}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug hover:text-amber-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        {(product.reviewCount ?? 0) > 0 && (
          <div className="mt-1.5">
            <StarRating rating={product.avgRating ?? 0} size="sm" count={product.reviewCount} />
          </div>
        )}

        {/* Tags */}
        <div className="flex gap-1.5 mt-3 flex-wrap">
          <span className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full capitalize font-medium border border-gray-100">{product.frameType}</span>
          <span className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full capitalize font-medium border border-gray-100">{product.shape}</span>
          {product.prescriptionSupported && (
            <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium border border-purple-100">Rx Ready</span>
          )}
        </div>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div>
            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.comparePrice && (
              <span className="ml-2 text-xs text-gray-400 line-through">${product.comparePrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={() => addItem(product, 1)}
            disabled={product.stock === 0}
            className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md hover:shadow-amber-500/20"
          >
            {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
