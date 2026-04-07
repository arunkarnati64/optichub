'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Category } from '@/types';

interface FormData {
  name: string;
  slug: string;
  description: string;
  price: string;
  comparePrice: string;
  images: string;
  featured: boolean;
  brand: string;
  frameType: string;
  frameMaterial: string;
  frameColor: string;
  lensType: string;
  lensMaterial: string;
  gender: string;
  shape: string;
  lensWidth: string;
  bridgeWidth: string;
  templeLength: string;
  sizeLabel: string;
  weight: string;
  prescriptionSupported: boolean;
  blueLightFilter: boolean;
  antiGlare: boolean;
  uvProtection: boolean;
  styleTags: string;
  faceShapeRecommendation: string;
  category: string;
  stock: string;
  supplierName: string;
  supplierProductId: string;
  supplierPrice: string;
  supplierLink: string;
  estimatedShippingTime: string;
}

const defaultForm: FormData = {
  name: '', slug: '', description: '', price: '', comparePrice: '',
  images: '', featured: false, brand: '', frameType: 'full-rim',
  frameMaterial: 'metal', frameColor: '', lensType: 'clear',
  lensMaterial: 'polycarbonate', gender: 'unisex', shape: 'aviator',
  lensWidth: '', bridgeWidth: '', templeLength: '', sizeLabel: 'M',
  weight: '', prescriptionSupported: false, blueLightFilter: false,
  antiGlare: false, uvProtection: false, styleTags: '',
  faceShapeRecommendation: '', category: '', stock: '0',
  supplierName: 'mock', supplierProductId: '', supplierPrice: '0',
  supplierLink: '', estimatedShippingTime: '7-14 business days',
};

interface Props {
  productId?: string;
  initialData?: Partial<FormData>;
}

export default function ProductForm({ productId, initialData }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ ...defaultForm, ...initialData });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/products/categories').then(({ data }) => setCategories(data));
  }, []);

  const set = (key: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggle = (key: keyof FormData) => () =>
    setForm((f) => ({ ...f, [key]: !f[key] }));

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        slug: form.slug || autoSlug(form.name),
        description: form.description,
        price: Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
        images: form.images.split('\n').map(s => s.trim()).filter(Boolean),
        featured: form.featured,
        brand: form.brand,
        frameType: form.frameType,
        frameMaterial: form.frameMaterial,
        frameColor: form.frameColor.split(',').map(s => s.trim()).filter(Boolean),
        lensType: form.lensType,
        lensMaterial: form.lensMaterial,
        gender: form.gender,
        shape: form.shape,
        size: {
          lensWidth: Number(form.lensWidth),
          bridgeWidth: Number(form.bridgeWidth),
          templeLength: Number(form.templeLength),
          label: form.sizeLabel,
        },
        weight: form.weight ? Number(form.weight) : undefined,
        prescriptionSupported: form.prescriptionSupported,
        blueLightFilter: form.blueLightFilter,
        antiGlare: form.antiGlare,
        uvProtection: form.uvProtection,
        styleTags: form.styleTags.split(',').map(s => s.trim()).filter(Boolean),
        faceShapeRecommendation: form.faceShapeRecommendation.split(',').map(s => s.trim()).filter(Boolean),
        category: form.category,
        stock: Number(form.stock),
        supplierName: form.supplierName,
        supplierProductId: form.supplierProductId,
        supplierPrice: Number(form.supplierPrice),
        supplierLink: form.supplierLink,
        estimatedShippingTime: form.estimatedShippingTime,
      };

      if (productId) {
        await api.put(`/products/${productId}`, payload);
      } else {
        await api.post('/products', payload);
      }

      router.push('/admin/products');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400";
  const selectClass = "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{productId ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the eyewear product details below</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()}
            className="px-5 py-2.5 text-sm border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="px-5 py-2.5 text-sm bg-amber-500 text-white rounded-full font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50">
            {loading ? 'Saving...' : productId ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>

      {error && <div className="mb-6 bg-red-50 text-red-700 text-sm p-4 rounded-xl">{error}</div>}

      <div className="space-y-8">

        {/* Basic Info */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Product Name *</label>
              <input required value={form.name} onChange={(e) => {
                setForm(f => ({ ...f, name: e.target.value, slug: autoSlug(e.target.value) }));
              }} className={inputClass} placeholder="AeroFrame Classic Aviator" />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input value={form.slug} onChange={set('slug')} className={inputClass} placeholder="auto-generated" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Brand *</label>
              <input required value={form.brand} onChange={set('brand')} className={inputClass} placeholder="Ray-Ban" />
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              <select required value={form.category} onChange={set('category')} className={selectClass}>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Description *</label>
            <textarea required value={form.description} onChange={set('description')}
              rows={3} className={`${inputClass} resize-none`} placeholder="Describe the product..." />
          </div>
          <div>
            <label className={labelClass}>Image URLs (one per line)</label>
            <textarea value={form.images} onChange={set('images')}
              rows={3} className={`${inputClass} resize-none`}
              placeholder="https://images.unsplash.com/..." />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={form.featured} onChange={toggle('featured')}
              className="w-4 h-4 accent-amber-500" />
            <label htmlFor="featured" className="text-sm text-gray-700 font-medium">Featured product (show on homepage)</label>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Pricing & Inventory</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Selling Price ($) *</label>
              <input required type="number" min="0" step="0.01" value={form.price}
                onChange={set('price')} className={inputClass} placeholder="49.99" />
            </div>
            <div>
              <label className={labelClass}>Compare Price ($)</label>
              <input type="number" min="0" step="0.01" value={form.comparePrice}
                onChange={set('comparePrice')} className={inputClass} placeholder="89.99" />
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <input type="number" min="0" value={form.stock}
                onChange={set('stock')} className={inputClass} placeholder="50" />
            </div>
          </div>
        </section>

        {/* Frame Specs */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Frame Specifications</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Frame Type</label>
              <select value={form.frameType} onChange={set('frameType')} className={selectClass}>
                {['full-rim','half-rim','rimless','supra'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Frame Material</label>
              <select value={form.frameMaterial} onChange={set('frameMaterial')} className={selectClass}>
                {['acetate','metal','titanium','tr90','wood','mixed'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Lens Type</label>
              <select value={form.lensType} onChange={set('lensType')} className={selectClass}>
                {['clear','tinted','polarized','photochromic','mirrored'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Lens Material</label>
              <select value={form.lensMaterial} onChange={set('lensMaterial')} className={selectClass}>
                {['polycarbonate','trivex','glass','cr39'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Shape</label>
              <select value={form.shape} onChange={set('shape')} className={selectClass}>
                {['aviator','round','square','rectangle','cat-eye','oval','wayfarer','geometric'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <select value={form.gender} onChange={set('gender')} className={selectClass}>
                {['men','women','unisex','kids'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Frame Colors (comma-separated)</label>
            <input value={form.frameColor} onChange={set('frameColor')} className={inputClass}
              placeholder="black, gold, silver" />
          </div>
        </section>

        {/* Measurements */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Measurements</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Lens Width (mm)</label>
              <input type="number" value={form.lensWidth} onChange={set('lensWidth')} className={inputClass} placeholder="52" />
            </div>
            <div>
              <label className={labelClass}>Bridge (mm)</label>
              <input type="number" value={form.bridgeWidth} onChange={set('bridgeWidth')} className={inputClass} placeholder="18" />
            </div>
            <div>
              <label className={labelClass}>Temple (mm)</label>
              <input type="number" value={form.templeLength} onChange={set('templeLength')} className={inputClass} placeholder="140" />
            </div>
            <div>
              <label className={labelClass}>Size Label</label>
              <select value={form.sizeLabel} onChange={set('sizeLabel')} className={selectClass}>
                {['XS','S','M','L','XL'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="w-1/4">
            <label className={labelClass}>Weight (g)</label>
            <input type="number" value={form.weight} onChange={set('weight')} className={inputClass} placeholder="22" />
          </div>
        </section>

        {/* Features */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Features</h2>
          <div className="grid grid-cols-2 gap-3">
            {([
              ['prescriptionSupported', 'Prescription Ready'],
              ['blueLightFilter', 'Blue Light Filter'],
              ['antiGlare', 'Anti-Glare'],
              ['uvProtection', 'UV Protection'],
            ] as [keyof FormData, string][]).map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50">
                <input type="checkbox" checked={form[key] as boolean} onChange={toggle(key)}
                  className="w-4 h-4 accent-amber-500" />
                <span className="text-sm text-gray-700 font-medium">{label}</span>
              </label>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Style Tags (comma-separated)</label>
              <input value={form.styleTags} onChange={set('styleTags')} className={inputClass}
                placeholder="classic, sporty, minimal" />
            </div>
            <div>
              <label className={labelClass}>Face Shape Recommendations (comma-separated)</label>
              <input value={form.faceShapeRecommendation} onChange={set('faceShapeRecommendation')} className={inputClass}
                placeholder="oval, round, heart" />
            </div>
          </div>
        </section>

        {/* Supplier */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Supplier / Dropshipping</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Supplier Name</label>
              <input value={form.supplierName} onChange={set('supplierName')} className={inputClass} placeholder="mock" />
            </div>
            <div>
              <label className={labelClass}>Supplier Product ID</label>
              <input value={form.supplierProductId} onChange={set('supplierProductId')} className={inputClass} placeholder="MOCK-001" />
            </div>
            <div>
              <label className={labelClass}>Supplier Price ($)</label>
              <input type="number" min="0" step="0.01" value={form.supplierPrice}
                onChange={set('supplierPrice')} className={inputClass} placeholder="12.00" />
            </div>
            <div>
              <label className={labelClass}>Estimated Shipping Time</label>
              <input value={form.estimatedShippingTime} onChange={set('estimatedShippingTime')}
                className={inputClass} placeholder="7-14 business days" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Supplier Link</label>
            <input value={form.supplierLink} onChange={set('supplierLink')} className={inputClass}
              placeholder="https://aliexpress.com/..." />
          </div>
        </section>
      </div>
    </form>
  );
}
