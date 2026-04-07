import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as reviewService from '../services/review.service';

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5),
});

export const getReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reviews = await reviewService.getReviews(req.params.productId);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

export const createReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rating, comment } = reviewSchema.parse(req.body);
    const user = (req as any).user;
    const review = await reviewService.createReview(
      req.params.productId,
      String(user._id),
      user.name,
      rating,
      comment
    );
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};
