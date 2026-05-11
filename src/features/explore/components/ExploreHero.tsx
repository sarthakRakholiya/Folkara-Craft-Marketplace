"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export const ExploreHero = () => {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] flex items-center px-4 md:px-margin-page overflow-hidden">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuClEJEKPfOxZ0da7F_MMublyy0xMGSOtgF7WPyIZP9Exa0fiDah8sYJbl2v7CWDcsBZ7isE3Se5Z3fFfsSBGUSJCwEI-MYU82X4DaOnW6CUfj9520nX2tHK4Rv8F6sXIJL9OqpaVIbFPemfn4r-jKd_JjzggD4gTBF9-U1aAkhI-0_ao3CDBufa0iMPfpP9gO_eqFjE5Wt4dmle3bnDxyPk-QJp1mHt2nzlMdazuQSx7qAGms218JVKxhhTP2kWmPOYUi4ctlPlNAA"
          alt="Atmospheric artisan workshop"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-container-max mx-auto w-full">
        <div className="max-w-xl">
          <span className="font-sans text-xs md:text-sm tracking-[0.3em] uppercase text-primary mb-6 block font-semibold">
            CURATED SELECTION
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary mb-8 leading-[1.1] tracking-tight">
            Curated for your earthy minimal style
          </h1>
          <p className="font-sans text-lg md:text-xl text-on-surface-variant mb-10 max-w-md leading-relaxed">
            Discover unhurried pieces crafted by hand, reflecting the quiet soul of traditional artistry and modern minimalism.
          </p>
          <Button variant="primary" size="lg" className="rounded-full px-10 py-6 tracking-[0.2em] uppercase text-xs">
            EXPLORE COLLECTION
          </Button>
        </div>
      </div>
    </section>
  );
};
