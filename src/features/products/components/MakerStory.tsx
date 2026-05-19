import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface MakerStoryProps {
  maker: {
    name: string;
    shopName: string;
    bio?: string;
    imageUrl?: string;
    href: string;
    makerQuote?: string;
    establishedYear?: number;
  };
}

export const MakerStory = ({ maker }: MakerStoryProps) => {
  return (
    <section className="w-full bg-surface-container-low py-20 md:py-40 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary-container/10 rounded-full blur-[120px] -mr-64 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -ml-48 -mb-24"></div>

      <div className="max-w-container-max mx-auto px-margin-page grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-gutter items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="md:col-span-5 relative order-2 md:order-1"
        >
          <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
            {maker.imageUrl && (
              <Image
                src={maker.imageUrl}
                alt={maker.name}
                width={600}
                height={750}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            )}
          </div>
          {/* Signature Label */}
          <motion.div
            initial={{ opacity: 0, rotate: -10 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl rounded-2xl hidden md:block"
          >
            <p className="font-serif text-lg text-primary italic">
              Certified Folkara Artisan
            </p>
            <p className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">
              Mastery since {maker.establishedYear || "2024"}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:col-span-7 flex flex-col gap-6 md:gap-8 md:pl-16 order-1 md:order-2"
        >
          <div className="flex flex-col gap-3">
            <span className="font-sans text-[10px] md:text-xs font-bold text-secondary tracking-[0.4em] uppercase">
              The Maker Story
            </span>
            <h2 className="font-serif text-3xl md:text-display-md text-primary leading-tight">
              Meet {maker.name} of {maker.shopName}
            </h2>
          </div>

          <div className="space-y-6 md:space-y-8">
            <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed">
              {maker.bio}
            </p>
            <div className="relative">
              <span className="absolute -left-6 md:-left-10 top-0 font-serif text-6xl text-primary/10">
                "
              </span>
              <p className="font-serif text-xl md:text-2xl text-primary leading-relaxed italic pr-4">
                {maker.makerQuote}
              </p>
            </div>
          </div>

          <Link
            href={maker.href}
            className="group flex items-center gap-4 w-fit"
          >
            <span className="font-sans text-[10px] md:text-xs font-bold text-primary uppercase tracking-[0.2em] border-b border-primary/20 pb-1 group-hover:border-primary transition-all">
              Explore Shop
            </span>
            <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform duration-300">
              arrow_forward
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
