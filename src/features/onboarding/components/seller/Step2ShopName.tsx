"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ShopNameSchema } from '../../types/onboarding.types';
import { FormInput } from '@/components/form/FormInput';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { toast } from 'sonner';

export const Step2ShopName = () => {
  const { control, watch, setValue } = useFormContext<ShopNameSchema>();
  const shopName = watch('shopName') || '';
  const previewUrl = watch('logoUrl') || null;
  const [hasNewUpload, setHasNewUpload] = React.useState(false);

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
            <ImageUpload
              folder="shops/logos"
              onUploadComplete={(image) => {
                setValue('logoUrl', image.url, { shouldValidate: true, shouldDirty: true });
                setValue('logoPublicId', image.publicId, { shouldValidate: true, shouldDirty: true });
                setHasNewUpload(true);
              }}
              onUploadError={(err) => toast.error(err)}
              currentImageUrl={previewUrl || undefined}
              currentPublicId={watch('logoPublicId') || undefined}
              isUnsaved={hasNewUpload}
              hint="JPG, PNG or WebP · max 5 MB"
              shape="rectangle"
              aspectRatio="auto"
              width="100%"
              height="100%"
              maxWidth="100%"
              maxHeight={400}
            />
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
