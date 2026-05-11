"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

interface Step1BuyerWelcomeProps {
  onContinue: () => void;
}

export const Step1BuyerWelcome = ({ onContinue }: Step1BuyerWelcomeProps) => {
  return (
    <div className="flex flex-col items-center text-center gap-6">
      {/* Hero Section */}
      <div className="w-full max-w-3xl">
        <div className="relative overflow-hidden rounded-xl bg-surface-container shadow-sm aspect-[21/9]">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrBxyHAV6Y5JHlwRelMXYPWnWrZ8IS_H-G-0Q7PBkvi5d5C-SHhbbHQvsuXt_MI4n4wdWVHknP13roLRPigd61VywbqTQm4OQVtZpITgBevo2C4wATB68BIjWaQUK7fuLcv5qTYPMT3xeAbGNBMrY8vP_BM2y-CizgB9VfNOYTIZuTEiiNt4Mv0OmebzwWohfrVEIwJwWNS3NvYwnzR9p5Av6dOIUf_t0JFaP8v5mHi5OYPJGgB3YAOYgGElS5aiSNsYNTYdRWs7I"
            alt="A serene and cozy living room scene showcasing high-quality handcrafted lifestyle elements."
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>

      {/* Text Content */}
      <div className="flex flex-col gap-4 max-w-2xl px-4">
        <h1 className="text-4xl md:text-5xl font-serif text-primary leading-tight">
          Welcome to Folkara
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant leading-relaxed">
          Discover handmade pieces curated around your personal style. We connect you with artisans who celebrate the maker's hand and intentional living.
        </p>
      </div>

      {/* Call to Action */}
      <div className="flex flex-col items-center gap-4 mt-2 mb-6">
        <Button 
          onClick={onContinue}
          size="lg"
          shape="full"
          className="px-12 py-3 text-base font-semibold shadow-xl shadow-primary/20"
        >
          Let's Begin
        </Button>
        
        {/* Minimalist AI Guide hint */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-container-low border border-tertiary-fixed-dim/30">
          <span className="material-symbols-outlined text-tertiary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <p className="text-xs italic font-serif text-on-tertiary-fixed-variant">
            Your personal curation guide is ready to help you find something special.
          </p>
        </div>
      </div>

      {/* Secondary Product Grid (Subtle Aesthetic Teaser) */}
      <section className="w-full pt-6 border-t border-outline-variant/30">
        <p className="text-label-caps text-on-surface-variant mb-6 tracking-widest uppercase">
          A glimpse of our collection
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ProductTeaserItem 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC09xqEBtuOkZyP5PYseokOCDHJaK1OV1adRmengA-MDsz5QKEgLApxIXB4I-ltFrtT6WBi1febBnR_Wg9g2FXCesRkZ5WTvgMOzwr8BfZKcvG9Xv2hJTRx2x95PqKBiIoJrgp8CuU23viap4vTSfeZA49PXwA00vHa8VpLkISC66tgvFW8pnN3VtlwmKQzNm-EARv-B90R1r2m7VSECzGZ04TCpSF4ZHeGzhfbr95kx8tkbfo2fNs1Kj_W4UVxhVD4xlg8dSAMZy8"
            title="Earthenware Vase"
          />
          <ProductTeaserItem 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_R8X9EB9lK4-26v3tg5729FiheABKUdrXu0W6RE0P7nqbk7kvqsEq0h9RuSDxMdx4qOL65NjNfIug9UZMJF2ZmpcnVVsOZQXYPybxzcew-8Jdn-Wly7b49PiGs3Dc6lI59EAyoX3q3kguWZJfpXWTblgUJJ3Yb9D5DQgQStgLYbwa0l92WlTZYN55GITKWFnDuCk3HlSsE81DHyjn6Y-TUqLwWTU_kzZrIYMA8jEGuYQ0wC_3nOoLjMXQ6jNGjdHi97UA_RzZF2E"
            title="Hand-loomed Linen"
            className="mt-8"
          />
          <ProductTeaserItem 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJqZMgU-z11ItI1IW70Ag1Ybr6gV1OVpyFOB05jvRRiRYL0EXbHsodhwxYbxFunKFg8ibFBlONDg5KSVNVHZBez99ip6BVp3doHxjD1eOl6arXQ8oMKQzmNoVm1wmd_RId3vmWrjrcNK0pRfZRf0PWnwDjJSw0PaK7B4r0DWqGg0yr8CAZmhpzEa_BCmsN15rn4oOyz5pb-Qd4DfVkt4uJyqJI7ksxieyx-yJZpw75XP-EuwP8GRBvsUwXtj0N5rN67gv0X7pXgBE"
            title="Sculpted Oak"
          />
          <ProductTeaserItem 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5FG-gu2zxUVQDTnvagPTWHu-Nl7rHSjqFsFRSiKPKB-uKF9wHU1kdxAvTGdMn__xE1eBKIyESm_TuxS93FNa_DGGKLZkoyklGYcsTOzgmvMFdr6pXLTH2cHSjkdJ1Fi0tKZ00O5Ie0Chr2SLqljd6UlWR-2A-qfjsoohAemRmy6yBdwFNv1CQfsj3nmoBP4EKFkkaXKJgvENeNOoU_qO2j_oz4txn3gQYNLmPNbS800jyY7BzBp99dzje3sW971m9EVhqGuYGV08"
            title="Smoke Glassware"
            className="mt-4"
          />
        </div>
      </section>
    </div>
  );
};

const ProductTeaserItem = ({ src, title, className = "" }: { src: string; title: string; className?: string }) => (
  <div className={`flex flex-col gap-3 text-left ${className}`}>
    <div className="aspect-square rounded-lg overflow-hidden bg-surface-container-high relative">
      <Image 
        src={src} 
        alt={title} 
        fill 
        className="object-cover hover:scale-105 transition-transform duration-700" 
      />
    </div>
    <span className="text-sm font-medium text-primary">{title}</span>
  </div>
);
