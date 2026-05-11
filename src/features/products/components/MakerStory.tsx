import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MakerStoryProps {
  maker: {
    name: string;
    bio?: string;
    imageUrl?: string;
    href: string;
  };
}

export const MakerStory = ({ maker }: MakerStoryProps) => {
  return (
    <section className="w-full bg-surface-container-low py-16 md:py-32">
      <div className="max-w-container-max mx-auto px-margin-page grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-gutter items-center">
        <div className="md:col-span-5 relative order-2 md:order-1">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
            {maker.imageUrl && (
              <Image 
                src={maker.imageUrl} 
                alt={maker.name} 
                width={500} 
                height={625} 
                className="w-full h-full object-cover" 
              />
            )}
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary-container/20 rounded-full blur-3xl -z-10"></div>
        </div>
        <div className="md:col-span-7 flex flex-col gap-4 md:gap-6 md:pl-16 order-1 md:order-2">
          <span className="font-sans text-[10px] md:text-xs font-bold text-secondary tracking-[0.3em] uppercase">The Maker</span>
          <h2 className="font-serif text-2xl md:text-5xl text-primary leading-tight">Meet Aanya of {maker.name}</h2>
          <div className="space-y-4 md:space-y-6">
            <p className="font-sans text-sm md:text-lg text-on-surface-variant leading-relaxed">
              {maker.bio}
            </p>
            <p className="font-serif text-base md:text-xl text-primary leading-relaxed italic border-l-4 border-primary/20 pl-4 md:pl-6">
              "I don't make products," Aanya says, "I make companions for your daily rituals. Each bowl carries the memory of the hands that shaped it."
            </p>
          </div>
          <Link 
            href={maker.href} 
            className="font-sans text-[10px] md:text-xs font-bold text-primary border-b border-primary w-fit pb-1 hover:text-secondary hover:border-secondary transition-all uppercase tracking-widest mt-2 md:mt-4"
          >
            Explore the Collection
          </Link>
        </div>
      </div>
    </section>
  );
};
