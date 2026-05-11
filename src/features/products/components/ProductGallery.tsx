"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
}

export const ProductGallery = ({ images }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="w-full md:w-[60%] flex flex-col md:flex-row gap-4">
      {/* Mobile Carousel (Hidden on Desktop) */}
      <div className="flex md:hidden overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 -mx-margin-page px-margin-page pb-4">
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className="flex-shrink-0 w-[85vw] snap-center rounded-xl overflow-hidden bg-surface-container-low aspect-[4/5]"
          >
            <Image 
              src={img} 
              alt={`Product ${idx + 1}`} 
              width={600} 
              height={750} 
              className="w-full h-full object-cover" 
            />
          </div>
        ))}
      </div>

      {/* Desktop Vertical Thumbnails */}
      <div className="hidden md:flex flex-col gap-4">
        {images.map((img, idx) => (
          <div 
            key={idx}
            onMouseEnter={() => setSelectedImage(img)}
            className={cn(
              "w-20 h-20 rounded-lg overflow-hidden bg-surface-container cursor-pointer border transition-all duration-300",
              selectedImage === img ? "border-primary" : "border-transparent hover:border-outline-variant"
            )}
          >
            <Image 
              src={img} 
              alt={`Thumbnail ${idx + 1}`} 
              width={80} 
              height={80} 
              className="w-full h-full object-cover" 
            />
          </div>
        ))}
      </div>

      {/* Main Image (Desktop Only) */}
      <div className="hidden md:block flex-1 rounded-2xl overflow-hidden shadow-sm bg-surface-container-low h-[700px] group">
        <Image 
          src={selectedImage} 
          alt="Main Product Image" 
          width={800} 
          height={1000} 
          priority
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
      </div>
    </div>
  );
};
