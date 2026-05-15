import Image from 'next/image';
import { motion } from 'framer-motion';

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
    <section className="max-w-container-max mx-auto px-margin-page py-12 md:py-24 border-t border-outline-variant/10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col gap-12 md:gap-20"
      >
        <div className="flex flex-col gap-4 items-center text-center">
          <h2 className="font-serif text-3xl md:text-display-sm text-primary">Voices from the community</h2>
          <p className="font-sans text-sm md:text-base text-on-surface-variant uppercase tracking-widest font-bold">4.9 Average Rating • 128 Reviews</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-gutter">
          {reviews.map((review, idx) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="flex flex-col gap-6 p-8 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 transition-all duration-500 group relative overflow-hidden"
            >
              
              <StarRating rating={review.rating} />
              
              <p className="font-serif text-lg md:text-xl text-on-surface italic leading-relaxed group-hover:text-primary transition-colors relative z-10">
                {review.content}
              </p>
              
              <div className="flex items-center gap-4 pt-4 mt-auto relative z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                  <Image 
                    src={review.avatarUrl} 
                    alt={review.author} 
                    width={48} 
                    height={48} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-sans text-[11px] font-bold text-primary uppercase tracking-widest">{review.author}</span>
                  <span className="font-sans text-[9px] text-on-surface-variant uppercase tracking-wider">Verified Purchase</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
