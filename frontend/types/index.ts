export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface ProductSize {
  lensWidth: number;
  bridgeWidth: number;
  templeLength: number;
  label: 'XS' | 'S' | 'M' | 'L' | 'XL';
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  isActive: boolean;
  featured: boolean;

  brand: string;
  frameType: 'full-rim' | 'half-rim' | 'rimless' | 'supra';
  frameMaterial: 'acetate' | 'metal' | 'titanium' | 'tr90' | 'wood' | 'mixed';
  frameColor: string[];
  lensType: 'clear' | 'tinted' | 'polarized' | 'photochromic' | 'mirrored';
  lensMaterial: 'polycarbonate' | 'trivex' | 'glass' | 'cr39';
  gender: 'men' | 'women' | 'unisex' | 'kids';
  shape: 'aviator' | 'round' | 'square' | 'rectangle' | 'cat-eye' | 'oval' | 'wayfarer' | 'geometric';
  size: ProductSize;
  weight: number;

  prescriptionSupported: boolean;
  blueLightFilter: boolean;
  antiGlare: boolean;
  uvProtection: boolean;

  styleTags: string[];
  faceShapeRecommendation: string[];

  category: Category;
  stock: number;

  supplierName: string;
  estimatedShippingTime: string;

  avgRating: number;
  reviewCount: number;

  createdAt: string;
}

export interface Review {
  _id: string;
  user: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
