import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
} from '../controllers/product.controller';
import { getReviews, createReview } from '../controllers/review.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = Router();

// Public
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:slug', getProductBySlug);

// Reviews
router.get('/:productId/reviews', getReviews);
router.post('/:productId/reviews', protect, createReview);

// Admin
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/categories', protect, adminOnly, createCategory);

export default router;
