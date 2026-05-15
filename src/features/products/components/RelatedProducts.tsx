import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface RelatedProductsProps {
  products: Array<{
    id: string;
    title: string;
    price: string;
    imageUrl: string;
  }>;
}

const ProductCardSimple = ({ product, className, imageAspect, index }: { 
  product: RelatedProductsProps['products'][0], 
  className?: string,
  imageAspect: string,
  index: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
  >
    <Link href={`/products/${product.id}`} className={cn("flex flex-col gap-4 group", className)}>
      <div className={cn("bg-surface-container rounded-3xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-700", imageAspect)}>
        <Image 
          src={product.imageUrl} 
          alt={product.title} 
          width={400} 
          height={500} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
        />
      </div>
      <div className="px-1">
        <p className="font-sans text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">{product.title}</p>
        <p className="font-serif text-lg text-primary mt-1">{product.price}</p>
      </div>
    </Link>
  </motion.div>
);

export const RelatedProducts = ({ products }: RelatedProductsProps) => {
  if (products.length < 4) return null;

  return (
    <section className="max-w-container-max mx-auto px-margin-page py-12 md:py-24">
      <div className="flex flex-col gap-12 md:gap-20">
        <div className="flex flex-col gap-3 md:gap-4 items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="px-4 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-sans text-[10px] font-bold tracking-[0.15em] uppercase flex items-center gap-2 mb-2 shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            AI Guide Recommendations
          </motion.div>
          <h2 className="font-serif text-3xl md:text-display-sm text-primary max-w-2xl">
            Pairs beautifully with these pieces
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-gutter">
          <ProductCardSimple 
            product={products[0]} 
            imageAspect="aspect-square" 
            className="md:mt-12" 
            index={0}
          />
          <ProductCardSimple 
            product={products[1]} 
            imageAspect="aspect-[4/5]" 
            index={1}
          />
          <ProductCardSimple 
            product={products[2]} 
            imageAspect="aspect-square" 
            className="md:mt-24" 
            index={2}
          />
          <ProductCardSimple 
            product={products[3]} 
            imageAspect="aspect-[3/4]" 
            className="md:mt-8" 
            index={3}
          />
        </div>
      </div>
    </section>
  );
};
