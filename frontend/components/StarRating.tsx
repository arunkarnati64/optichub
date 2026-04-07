interface StarRatingProps {
  rating: number;    // 0–5, supports decimals
  size?: 'sm' | 'md';
  showValue?: boolean;
  count?: number;
}

export default function StarRating({ rating, size = 'sm', showValue = false, count }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];
  const sz = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {stars.map((star) => {
          const fill = Math.min(1, Math.max(0, rating - (star - 1)));
          return (
            <svg key={star} className={sz} viewBox="0 0 20 20">
              <defs>
                <linearGradient id={`star-${star}-${rating}`}>
                  <stop offset={`${fill * 100}%`} stopColor="#f59e0b" />
                  <stop offset={`${fill * 100}%`} stopColor="#d1d5db" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#star-${star}-${rating})`}
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-xs text-gray-400">({count})</span>
      )}
    </div>
  );
}
