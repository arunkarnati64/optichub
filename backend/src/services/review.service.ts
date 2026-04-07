import { Review } from '../models/Review';
import { Product } from '../models/Product';

export const getReviews = async (productId: string) => {
  return Review.find({ product: productId }).sort({ createdAt: -1 });
};

export const createReview = async (
  productId: string,
  userId: string,
  userName: string,
  rating: number,
  comment: string
) => {
  const existing = await Review.findOne({ product: productId, user: userId });
  if (existing) throw new Error('You have already reviewed this product');

  const review = await Review.create({ product: productId, user: userId, userName, rating, comment });

  // Recalculate product avg rating
  const stats = await Review.aggregate([
    { $match: { product: review.product } },
    { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      avgRating: Math.round(stats[0].avg * 10) / 10,
      reviewCount: stats[0].count,
    });
  }

  return review;
};
