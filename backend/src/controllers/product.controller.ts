import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as productService from '../services/product.service';

const sizeSchema = z.object({
  lensWidth: z.number().optional(),
  bridgeWidth: z.number().optional(),
  templeLength: z.number().optional(),
  label: z.enum(['XS', 'S', 'M', 'L', 'XL']).optional(),
});

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  images: z.array(z.string()).default([]),
  featured: z.boolean().default(false),

  brand: z.string().min(1),
  frameType: z.enum(['full-rim', 'half-rim', 'rimless', 'supra']),
  frameMaterial: z.enum(['acetate', 'metal', 'titanium', 'tr90', 'wood', 'mixed']),
  frameColor: z.array(z.string()).default([]),
  lensType: z.enum(['clear', 'tinted', 'polarized', 'photochromic', 'mirrored']),
  lensMaterial: z.enum(['polycarbonate', 'trivex', 'glass', 'cr39']),
  gender: z.enum(['men', 'women', 'unisex', 'kids']),
  shape: z.enum(['aviator', 'round', 'square', 'rectangle', 'cat-eye', 'oval', 'wayfarer', 'geometric']),
  size: sizeSchema.optional(),
  weight: z.number().optional(),

  prescriptionSupported: z.boolean().default(false),
  blueLightFilter: z.boolean().default(false),
  antiGlare: z.boolean().default(false),
  uvProtection: z.boolean().default(false),

  styleTags: z.array(z.string()).default([]),
  faceShapeRecommendation: z.array(z.string()).default([]),

  category: z.string(),
  stock: z.number().int().min(0).default(0),

  supplierName: z.string().default('mock'),
  supplierProductId: z.string().default(''),
  supplierPrice: z.number().default(0),
  supplierLink: z.string().default(''),
  estimatedShippingTime: z.string().default('7-14 business days'),
});

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      search, category, gender, frameType, frameMaterial,
      shape, lensType, frameColor, minPrice, maxPrice,
      blueLightFilter, prescriptionSupported, uvProtection,
      featured, sort, page, limit,
    } = req.query;

    const result = await productService.getProducts({
      search: search as string,
      category: category as string,
      gender: gender as string,
      frameType: frameType as string,
      frameMaterial: frameMaterial as string,
      shape: shape as string,
      lensType: lensType as string,
      frameColor: frameColor as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      blueLightFilter: blueLightFilter === 'true',
      prescriptionSupported: prescriptionSupported === 'true',
      uvProtection: uvProtection === 'true',
      featured: featured === 'true',
      sort: sort as any,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await productService.getFeaturedProducts(Number(req.query.limit) || 8);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await productService.getCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = productSchema.parse(req.body);
    const product = await productService.createProduct(data as any);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = productSchema.partial().parse(req.body);
    const product = await productService.updateProduct(req.params.id, data as any);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name } = z.object({ name: z.string().min(2) }).parse(req.body);
    const category = await productService.createCategory(name);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};
