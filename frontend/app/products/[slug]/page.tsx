import { notFound } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { Product } from '@/types';
import AddToCartButton from '@/components/product/AddToCartButton';
import StarRating from '@/components/StarRating';
import ReviewSection from '@/components/product/ReviewSection';

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const { data } = await api.get(`/products/${slug}`);
    return data;
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return notFound();

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden">
            {product.images[0] ? (
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
            ) : (
              <div className="flex items-center justify-center h-full text-7xl">🕶️</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1).map((img, i) => (
                <div key={i} className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden">
                  <Image src={img} alt={`${product.name} ${i + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-2">{product.brand}</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

          {product.reviewCount > 0 && (
            <div className="mb-3">
              <StarRating rating={product.avgRating} size="md" showValue count={product.reviewCount} />
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.comparePrice && (
              <span className="text-xl text-gray-400 line-through">${product.comparePrice.toFixed(2)}</span>
            )}
            {discount && (
              <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded-full">Save {discount}%</span>
            )}
          </div>

          {/* Feature badges */}
          <div className="flex gap-2 flex-wrap mb-6">
            {product.uvProtection && (
              <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">☀️ UV400</span>
            )}
            {product.blueLightFilter && (
              <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">🔵 Blue Light Filter</span>
            )}
            {product.antiGlare && (
              <span className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">✨ Anti-Glare</span>
            )}
            {product.prescriptionSupported && (
              <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">👓 Rx Ready</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

          {/* Add to Cart */}
          <AddToCartButton product={product} />

          <p className="text-sm text-gray-400 mt-4">
            🚚 Est. delivery: <span className="text-gray-600 font-medium">{product.estimatedShippingTime}</span>
          </p>

          {/* Specs grid */}
          <div className="mt-8 border-t border-gray-100 pt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Frame Specifications</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Frame Type', value: product.frameType },
                { label: 'Frame Material', value: product.frameMaterial },
                { label: 'Lens Type', value: product.lensType },
                { label: 'Lens Material', value: product.lensMaterial },
                { label: 'Shape', value: product.shape },
                { label: 'Gender', value: product.gender },
                { label: 'Size', value: product.size?.label },
                { label: 'Weight', value: product.weight ? `${product.weight}g` : undefined },
              ]
                .filter((s) => s.value)
                .map((spec) => (
                  <div key={spec.label} className="bg-gray-50 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-400 mb-0.5">{spec.label}</p>
                    <p className="text-sm font-semibold text-gray-800 capitalize">{spec.value}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Measurements */}
          {product.size && (
            <div className="mt-6 bg-amber-50 rounded-xl p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Measurements</h3>
              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <p className="font-bold text-gray-900">{product.size.lensWidth}mm</p>
                  <p className="text-xs text-gray-500">Lens Width</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">{product.size.bridgeWidth}mm</p>
                  <p className="text-xs text-gray-500">Bridge</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">{product.size.templeLength}mm</p>
                  <p className="text-xs text-gray-500">Temple</p>
                </div>
              </div>
            </div>
          )}

          {/* Face shapes */}
          {product.faceShapeRecommendation.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Best for face shapes:</p>
              <div className="flex gap-2 flex-wrap">
                {product.faceShapeRecommendation.map((shape) => (
                  <span key={shape} className="capitalize text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{shape}</span>
                ))}
              </div>
            </div>
          )}

          {/* Style tags */}
          {product.styleTags.length > 0 && (
            <div className="mt-4 flex gap-2 flex-wrap">
              {product.styleTags.map((tag) => (
                <span key={tag} className="capitalize text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <ReviewSection
        productId={product._id}
        avgRating={product.avgRating ?? 0}
        reviewCount={product.reviewCount ?? 0}
      />
    </div>
  );
}
