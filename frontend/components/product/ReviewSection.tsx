'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Review } from '@/types';
import StarRating from '@/components/StarRating';
import api from '@/lib/api';

interface Props {
  productId: string;
  avgRating: number;
  reviewCount: number;
}

export default function ReviewSection({ productId, avgRating, reviewCount }: Props) {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get(`/products/${productId}/reviews`)
      .then(({ data }) => setReviews(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating'); return; }
    if (comment.trim().length < 5) { setError('Review must be at least 5 characters'); return; }
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post(`/products/${productId}/reviews`, { rating, comment });
      setReviews((prev) => [data, ...prev]);
      setSuccess('Review submitted!');
      setRating(0);
      setComment('');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const alreadyReviewed = user
    ? reviews.some((r) => r.user === user._id)
    : false;

  return (
    <section className="mt-16 border-t border-gray-100 pt-12">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
        {reviewCount > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={avgRating} size="md" showValue count={reviewCount} />
          </div>
        )}
      </div>

      {/* Write a review */}
      {user && !alreadyReviewed && (
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star picker */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Your Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <svg
                      className="w-8 h-8 transition-colors"
                      viewBox="0 0 20 20"
                      fill={(hovered || rating) >= star ? '#f59e0b' : '#d1d5db'}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Your Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Share your experience with this product…"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}
            {success && <p className="text-xs text-green-600">{success}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold rounded-full px-6 py-2.5 text-sm transition-colors"
            >
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {!user && (
        <p className="text-sm text-gray-500 mb-8">
          <a href="/login" className="text-amber-600 hover:underline font-medium">Sign in</a> to write a review.
        </p>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl" />)}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review._id} className="border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-sm font-bold text-amber-600">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-sm text-gray-900">{review.userName}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <StarRating rating={review.rating} size="sm" />
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
