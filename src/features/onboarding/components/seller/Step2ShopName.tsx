"use client";

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ShopNameSchema } from '../../types/onboarding.types';
import { cn } from '@/lib/utils';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/form/FormInput';

export const Step2ShopName = () => {
  const { control, watch, setValue, formState: { errors } } = useFormContext<ShopNameSchema>();
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const shopName = watch('shopName') || '';

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setValue('logoUrl', url); // In a real app, you'd upload this to a server
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
  };

  const removeLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setValue('logoUrl', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-container-max mx-auto flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-16 items-start pb-4">
      {/* Left Column: Form Content */}
      <div className="flex flex-col gap-8 w-full">
        {/* Header Section */}
        <div className="text-left space-y-2">
          <h1 className="font-serif text-2xl md:text-4xl text-primary leading-tight">Give your shop a name</h1>
          <p className="font-sans text-base md:text-lg text-on-surface-variant max-w-lg">
            Choose a name that reflects your craft and story. You can always change this later.
          </p>
        </div>

        {/* Input Section */}
        <div className="w-full flex flex-col gap-8">
          <div className="relative group">
            <FormInput 
              control={control}
              name="shopName"
              size="lg"
              placeholder="e.g. Hearth & Earth Pottery"
              inputClassName="font-serif !py-4 !rounded-none"
              className="space-y-0"
            />
          </div>

          {/* Logo Upload Section */}
          <div className="space-y-3 w-full">
            <label className="block font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">
              Shop Logo
            </label>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onFileSelect} 
              accept="image/*" 
              className="hidden" 
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={cn(
                "relative border-2 border-dashed rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group/upload bg-surface-container-low/30 overflow-hidden min-h-[220px]",
                isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-outline-variant hover:border-primary/50 hover:bg-white",
                previewUrl && "border-solid border-primary/30"
              )}
            >
              {previewUrl ? (
                <div className="relative w-28 h-28 md:w-36 md:h-36">
                  <img src={previewUrl} alt="Logo preview" className="w-full h-full object-cover rounded-xl shadow-lg" />
                  <button 
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 bg-error text-white p-1.5 rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-outline group-hover/upload:text-primary transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                      upload_file
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="font-serif text-base text-on-surface">
                      Drag and drop your logo, or <span className="text-primary font-bold underline decoration-primary/30">browse files</span>
                    </p>
                    <p className="font-sans text-[10px] font-bold text-outline mt-1 uppercase tracking-widest">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Live Preview */}
      <div className="w-full lg:sticky lg:top-24 space-y-4">
        <div className="bg-surface-container-low p-8 rounded-2xl text-center space-y-8 border border-outline-variant/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/10"></div>
          
          <div className="flex flex-col items-center gap-6">
            <span className="font-sans text-[8px] font-bold text-outline tracking-[0.4em] uppercase">Shop Preview</span>
            
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-surface-container-high border-4 border-white shadow-xl flex items-center justify-center">
              {previewUrl ? (
                <img src={previewUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="text-outline/30">
                  <span className="material-symbols-outlined text-[64px]">storefront</span>
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <h2 className="font-serif text-2xl md:text-3xl text-primary break-words max-w-[280px]">
                {shopName || 'Your Shop Name'}
              </h2>
              <p className="font-sans text-[9px] font-bold text-outline uppercase tracking-[0.3em]">Official Shop</p>
            </div>
          </div>

          <div className="pt-6 border-t border-outline-variant/10 flex justify-center items-center gap-3">
             <div className="flex -space-x-1.5">
               {[1,2,3].map(i => (
                 <div key={i} className="w-5 h-5 rounded-full bg-surface-container-highest border-2 border-surface-container-low" />
               ))}
             </div>
             <span className="font-sans text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">Joining 2k+ Artisans</span>
          </div>
        </div>
      </div>
    </div>
  );
};
