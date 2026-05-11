import React from 'react';
import Image from 'next/image';

interface ProductReviewsProps {
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    content: string;
    avatarUrl: string;
  }>;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5 text-secondary">
    {[...Array(5)].map((_, i) => (
      <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: i < rating ? "'FILL' 1" : "'FILL' 0" }}>
        star
      </span>
    ))}
  </div>
);

export const ProductReviews = ({ reviews }: ProductReviewsProps) => {
  return (
    <section className="max-w-container-max mx-auto px-margin-page py-16 md:py-32 border-t border-outline-variant/10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-gutter">
        {reviews.map((review) => (
          <div key={review.id} className="flex flex-col gap-4 md:gap-6 p-6 md:p-8 bg-surface-container-low/40 rounded-2xl md:rounded-[2rem] border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow duration-500 group">
            <StarRating rating={review.rating} />
            <p className="font-serif text-base md:text-lg text-on-surface italic leading-relaxed group-hover:text-primary transition-colors">
              {review.content}
            </p>
            <div className="flex items-center gap-3 pt-2 md:pt-4 mt-auto">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-outline-variant/20 shadow-inner">
                <Image 
                  src={review.avatarUrl} 
                  alt={review.author} 
                  width={40} 
                  height={40} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className="font-sans text-[10px] md:text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">{review.author}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
