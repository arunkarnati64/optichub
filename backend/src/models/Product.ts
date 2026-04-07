import mongoose, { Document, Schema } from 'mongoose';

export interface IProductSize {
  lensWidth: number;
  bridgeWidth: number;
  templeLength: number;
  label: 'XS' | 'S' | 'M' | 'L' | 'XL';
}

export interface IProduct extends Document {
  // Core
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  isActive: boolean;
  featured: boolean;

  // Eyewear specific
  brand: string;
  frameType: 'full-rim' | 'half-rim' | 'rimless' | 'supra';
  frameMaterial: 'acetate' | 'metal' | 'titanium' | 'tr90' | 'wood' | 'mixed';
  frameColor: string[];
  lensType: 'clear' | 'tinted' | 'polarized' | 'photochromic' | 'mirrored';
  lensMaterial: 'polycarbonate' | 'trivex' | 'glass' | 'cr39';
  gender: 'men' | 'women' | 'unisex' | 'kids';
  shape: 'aviator' | 'round' | 'square' | 'rectangle' | 'cat-eye' | 'oval' | 'wayfarer' | 'geometric';
  size: IProductSize;
  weight: number;

  // Features
  prescriptionSupported: boolean;
  blueLightFilter: boolean;
  antiGlare: boolean;
  uvProtection: boolean;

  // Style & Discovery
  styleTags: string[];
  faceShapeRecommendation: string[];

  // Category & Inventory
  category: mongoose.Types.ObjectId;
  stock: number;

  // Dropshipping
  supplierName: string;
  supplierProductId: string;
  supplierPrice: number;
  supplierLink: string;
  estimatedShippingTime: string;

  // Reviews
  avgRating: number;
  reviewCount: number;

  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    // Core
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },

    // Eyewear specific
    brand: { type: String, required: true, trim: true },
    frameType: {
      type: String,
      enum: ['full-rim', 'half-rim', 'rimless', 'supra'],
      required: true,
    },
    frameMaterial: {
      type: String,
      enum: ['acetate', 'metal', 'titanium', 'tr90', 'wood', 'mixed'],
      required: true,
    },
    frameColor: [{ type: String }],
    lensType: {
      type: String,
      enum: ['clear', 'tinted', 'polarized', 'photochromic', 'mirrored'],
      required: true,
    },
    lensMaterial: {
      type: String,
      enum: ['polycarbonate', 'trivex', 'glass', 'cr39'],
      required: true,
    },
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex', 'kids'],
      required: true,
    },
    shape: {
      type: String,
      enum: ['aviator', 'round', 'square', 'rectangle', 'cat-eye', 'oval', 'wayfarer', 'geometric'],
      required: true,
    },
    size: {
      lensWidth: { type: Number },
      bridgeWidth: { type: Number },
      templeLength: { type: Number },
      label: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL'] },
    },
    weight: { type: Number },

    // Features
    prescriptionSupported: { type: Boolean, default: false },
    blueLightFilter: { type: Boolean, default: false },
    antiGlare: { type: Boolean, default: false },
    uvProtection: { type: Boolean, default: false },

    // Style & Discovery
    styleTags: [{ type: String }],
    faceShapeRecommendation: [{ type: String }],

    // Category & Inventory
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    stock: { type: Number, default: 0, min: 0 },

    // Dropshipping
    supplierName: { type: String, default: 'mock' },
    supplierProductId: { type: String, default: '' },
    supplierPrice: { type: Number, default: 0 },
    supplierLink: { type: String, default: '' },
    estimatedShippingTime: { type: String, default: '7-14 business days' },

    // Reviews
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Full-text search on name, brand, description
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema);
