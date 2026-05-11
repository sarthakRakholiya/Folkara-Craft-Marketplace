"use client";

import React, { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { ArtisanProfileSchema } from '../../types/onboarding.types';
import { cn } from '@/lib/utils';
import { Camera, Edit2, Sparkles, Verified } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { FormTextarea } from '@/components/form/FormTextarea';

export const Step4ArtisanProfile = () => {
  const { control, setValue } = useFormContext<ArtisanProfileSchema>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setValue('makerPortrait', url);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 pb-6">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-2xl md:text-4xl text-primary leading-tight">Artisan Profile</h1>
        <p className="font-sans text-sm md:text-base text-on-surface-variant italic max-w-md mx-auto">
          "Every piece has a heartbeat; your profile is the story of how that pulse began."
        </p>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center gap-3">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative group cursor-pointer"
          >
            <div className={cn(
              "w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center overflow-hidden border-2 transition-all duration-500",
              previewUrl ? "border-primary" : "border-dashed border-outline-variant bg-surface-container-high hover:border-primary"
            )}>
              {previewUrl ? (
                <img src={previewUrl} alt="Portrait" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <Camera className="w-8 h-8 text-on-surface-variant group-hover:text-primary transition-colors" />
              )}
            </div>
            <div className="absolute bottom-1 right-1 bg-primary text-on-primary rounded-full p-2 shadow-lg border-2 border-surface transform transition-transform group-hover:scale-110">
              <Edit2 size={12} />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <p className="font-sans text-[9px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Upload Maker Portrait</p>
        </div>

        {/* Identity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="firstName"
            label="First Name"
            placeholder="e.g. Elias"
            variant="default"
          />
          <FormInput
            control={control}
            name="lastName"
            label="Last Name"
            placeholder="e.g. Thorne"
            variant="default"
          />
        </div>

        {/* Maker's Quote */}
        <div className="space-y-3">
          <div className="flex justify-between items-end px-1">
            <div className="space-y-1">
              <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Maker's Quote</label>
              <p className="text-[10px] text-on-surface-variant leading-tight max-w-[280px]">
                This quote will appear on your product detail pages to build a personal connection with collectors.
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm shrink-0">
              <Sparkles size={12} className="animate-pulse" />
              Generate with AI
            </button>
          </div>
          <div className="relative group">
            <FormInput
              control={control}
              name="makerQuote"
              placeholder="I find the soul of the wood in the shavings on the floor."
              variant="default"
              inputClassName="font-serif italic text-lg md:text-xl px-12 text-center !py-6 h-auto"
            />
            <span className="absolute left-4 bottom-6 font-serif text-3xl text-outline-variant/30 select-none">“</span>
            <span className="absolute right-4 bottom-6 font-serif text-3xl text-outline-variant/30 select-none">”</span>
          </div>
        </div>

        {/* Your Story Section */}
        <div className="space-y-3">
          <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] px-1">Your Story</label>
          
          <div className="relative group">
            <FormTextarea
              control={control}
              name="story"
              placeholder="Tell us about your journey, your materials, and what inspires your hands to create..."
              rows={6}
              variant="default"
              textareaClassName="font-sans leading-relaxed p-5 text-sm"
            />
            
            {/* AI Hint - Desktop Only */}
            <div className="absolute -right-64 top-1/2 -translate-y-1/2 hidden xl:flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4">
              <div className="w-px h-16 bg-outline-variant/30" />
              <div className="bg-white p-4 rounded-2xl shadow-xl border border-outline-variant/10 max-w-[200px]">
                <p className="font-serif italic text-sm text-on-surface-variant leading-tight">
                  Try mentioning how long you've been practicing your craft.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Note on Authenticity */}
        <div className="p-4 md:p-6 bg-surface-container-highest/30 rounded-2xl flex items-start gap-4 border border-outline-variant/10">
          <Verified className="text-primary shrink-0" size={20} />
          <div className="space-y-0.5">
            <h4 className="font-sans text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Note on Authenticity</h4>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              In a world of mass production, your vulnerability is your value. Don't worry about being perfect; be human. Our community cherishes the stories of failed experiments as much as the final masterpieces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
