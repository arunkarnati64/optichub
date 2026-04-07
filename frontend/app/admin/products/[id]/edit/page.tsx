'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products?limit=100`).then(({ data }) => {
      const product = data.products.find((p: any) => p._id === id);
      if (product) {
        setInitialData({
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: String(product.price),
          comparePrice: product.comparePrice ? String(product.comparePrice) : '',
          images: (product.images ?? []).join('\n'),
          featured: product.featured,
          brand: product.brand,
          frameType: product.frameType,
          frameMaterial: product.frameMaterial,
          frameColor: (product.frameColor ?? []).join(', '),
          lensType: product.lensType,
          lensMaterial: product.lensMaterial,
          gender: product.gender,
          shape: product.shape,
          lensWidth: String(product.size?.lensWidth ?? ''),
          bridgeWidth: String(product.size?.bridgeWidth ?? ''),
          templeLength: String(product.size?.templeLength ?? ''),
          sizeLabel: product.size?.label ?? 'M',
          weight: product.weight ? String(product.weight) : '',
          prescriptionSupported: product.prescriptionSupported,
          blueLightFilter: product.blueLightFilter,
          antiGlare: product.antiGlare,
          uvProtection: product.uvProtection,
          styleTags: (product.styleTags ?? []).join(', '),
          faceShapeRecommendation: (product.faceShapeRecommendation ?? []).join(', '),
          category: product.category?._id ?? '',
          stock: String(product.stock),
          supplierName: product.supplierName,
          supplierProductId: product.supplierProductId,
          supplierPrice: String(product.supplierPrice),
          supplierLink: product.supplierLink,
          estimatedShippingTime: product.estimatedShippingTime,
        });
      }
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl" />)}
    </div>;
  }

  return <ProductForm productId={id as string} initialData={initialData} />;
}
