import { Product, IProduct } from '../models/Product';
import { Category } from '../models/Category';

interface ProductQuery {
  search?: string;
  category?: string;
  gender?: string;
  frameType?: string;
  frameMaterial?: string;
  shape?: string;
  lensType?: string;
  frameColor?: string;
  minPrice?: number;
  maxPrice?: number;
  blueLightFilter?: boolean;
  prescriptionSupported?: boolean;
  uvProtection?: boolean;
  featured?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'featured';
  page?: number;
  limit?: number;
}

export const getProducts = async (query: ProductQuery) => {
  const {
    search, category, gender, frameType, frameMaterial,
    shape, lensType, frameColor, minPrice, maxPrice,
    blueLightFilter, prescriptionSupported, uvProtection,
    featured, sort = 'newest', page = 1, limit = 12,
  } = query;

  const filter: any = { isActive: true };

  if (search) filter.$text = { $search: search };
  if (gender) filter.gender = gender;
  if (frameType) filter.frameType = frameType;
  if (frameMaterial) filter.frameMaterial = frameMaterial;
  if (shape) filter.shape = shape;
  if (lensType) filter.lensType = lensType;
  if (frameColor) filter.frameColor = { $in: frameColor.split(',') };
  if (blueLightFilter === true) filter.blueLightFilter = true;
  if (prescriptionSupported === true) filter.prescriptionSupported = true;
  if (uvProtection === true) filter.uvProtection = true;
  if (featured === true) filter.featured = true;

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) filter.category = cat._id;
  }

  const sortMap: Record<string, any> = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
    featured: { featured: -1, createdAt: -1 },
  };

  const skip = (page - 1) * limit;
  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort(sortMap[sort])
    .skip(skip)
    .limit(limit);

  return { products, total, page, pages: Math.ceil(total / limit) };
};

export const getProductBySlug = async (slug: string) => {
  const product = await Product.findOne({ slug, isActive: true }).populate('category', 'name slug');
  if (!product) throw new Error('Product not found');
  return product;
};

export const getFeaturedProducts = async (limit = 8) => {
  return Product.find({ isActive: true, featured: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const createProduct = async (data: Partial<IProduct>) => {
  return Product.create(data);
};

export const updateProduct = async (id: string, data: Partial<IProduct>) => {
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  if (!product) throw new Error('Product not found');
  return product;
};

export const deleteProduct = async (id: string) => {
  const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!product) throw new Error('Product not found');
  return product;
};

export const getCategories = async () => {
  return Category.find().sort({ name: 1 });
};

export const createCategory = async (name: string) => {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  return Category.create({ name, slug });
};
