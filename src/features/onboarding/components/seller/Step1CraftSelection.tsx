"use client";

import React, { useState, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { CRAFT_OPTIONS } from '../../constants/onboarding.constants';
import { CraftSelectionSchema } from '../../types/onboarding.types';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { CheckmarkIcon } from '@/assets/icons/CheckmarkIcon';

export const Step1CraftSelection = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext<CraftSelectionSchema>();
  const [searchQuery, setSearchQuery] = useState('');
  
  const selectedCraftIds = watch('craftIds') || [];

  const filteredCrafts = useMemo(() => {
    return CRAFT_OPTIONS.filter(craft => 
      craft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      craft.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleCraft = (id: string) => {
    if (selectedCraftIds.includes(id)) {
      setValue('craftIds', selectedCraftIds.filter(item => item !== id), { shouldValidate: true, shouldDirty: true });
    } else {
      setValue('craftIds', [...selectedCraftIds, id], { shouldValidate: true, shouldDirty: true });
    }
  };

  const renderCraftCard = (craft: typeof CRAFT_OPTIONS[0]) => {
    const isSelected = selectedCraftIds.includes(craft.id);
    return (
      <div 
        key={craft.id}
        onClick={() => toggleCraft(craft.id)}
        className={cn(
          "group relative bg-surface-container-low rounded-xl p-4 md:p-6 cursor-pointer border-2 transition-all duration-300 flex flex-col items-center justify-center text-center h-full min-h-[120px] md:min-h-[140px]",
          isSelected 
            ? "border-primary bg-white shadow-xl shadow-primary/5 ring-1 ring-primary" 
            : "border-transparent hover:border-outline-variant hover:bg-white"
        )}
      >
        {isSelected && (
          <div className="absolute top-3 right-3 bg-primary text-white p-1 rounded-full animate-in zoom-in duration-300">
            <CheckmarkIcon className="w-3 h-3" />
          </div>
        )}
        <span 
          className={cn(
            "material-symbols-outlined text-2xl md:text-3xl mb-2 transition-colors",
            isSelected ? "text-primary" : "text-outline"
          )}
          style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}
        >
          {craft.icon}
        </span>
        <h3 className="font-serif text-sm md:text-base text-on-surface mb-0.5">{craft.name}</h3>
        <p className="font-sans text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{craft.category}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-container-max mx-auto">
      <div className="max-w-4xl w-full text-center mb-10 md:mb-16">
        <h1 className="font-serif text-3xl md:text-5xl text-primary mb-4 leading-tight">What do you create?</h1>
        <p className="font-sans text-lg md:text-xl text-on-surface-variant mb-10">Select all that apply to your artistic journey</p>
        
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text"
            placeholder="Search categories (e.g. Pottery, Textiles...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-2xl py-4 pl-12 pr-12 text-on-surface font-sans text-sm md:text-base transition-all shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-4 flex items-center text-outline hover:text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr gap-4 md:gap-gutter w-full">
        {filteredCrafts.map((craft) => renderCraftCard(craft))}
      </div>

      {filteredCrafts.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-outline">
            <Search className="w-8 h-8" />
          </div>
          <p className="font-serif text-xl text-on-surface-variant">No crafts found matching "{searchQuery}"</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="text-primary underline font-sans text-sm font-bold uppercase tracking-widest"
          >
            Clear Search
          </button>
        </div>
      )}

      {errors.craftIds && (
        <p className="mt-8 text-error text-sm font-sans font-bold uppercase tracking-widest bg-error-container/20 px-6 py-2 rounded-full border border-error/10">
          {errors.craftIds.message}
        </p>
      )}

      {/* AI Guide Suggestion */}
      <div className="mt-16 max-w-xl w-full bg-white p-8 rounded-3xl shadow-sm border border-tertiary-fixed/30 relative">
        <div className="absolute -top-3 left-8 px-4 py-1 bg-tertiary-fixed text-on-tertiary-fixed font-sans text-[10px] font-bold rounded-full uppercase tracking-widest">
          THE AI GUIDE
        </div>
        <p className="font-serif text-lg md:text-xl italic text-secondary leading-relaxed">
          "Pick all the crafts that resonate with your soul's work. We use this to curate your workspace tools."
        </p>
      </div>
    </div>
  );
};
