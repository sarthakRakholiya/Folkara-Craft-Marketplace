"use client";

import React from 'react';
import { ExploreHero } from '../components/ExploreHero';
import { DiscoveryFeed } from '../components/DiscoveryFeed';
import { useExplore } from '../hooks/use-explore';

export const ExploreView = () => {
  const { data: items, isLoading, isError } = useExplore();

  return (
    <div className="w-full pb-24 pt-16">
      <ExploreHero />
      
      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : isError ? (
        <div className="flex flex-col justify-center items-center py-24 px-4 text-center">
          <h2 className="text-2xl font-serif text-primary mb-4">Something went wrong</h2>
          <p className="text-on-surface-variant max-w-md">We couldn&apos;t load the discovery feed. Please try again later.</p>
        </div>
      ) : (
        <DiscoveryFeed items={items || []} />
      )}
      
    </div>
  );
};
