"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ArtisanProfileSchema, SellerOnboardingSchema } from '../../types/onboarding.types';
import { Sparkles, Verified, Loader2 } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { FormTextarea } from '@/components/form/FormTextarea';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { toast } from 'sonner';
import { generateMakerQuote, generateMakerStory } from '@/features/aiAssistant/actions/ai.actions';

export const Step4ArtisanProfile = () => {
  const { control, setValue, watch, getValues } = useFormContext<SellerOnboardingSchema>();
  const previewUrl = watch('avatarUrl') || null;
  const [hasNewUpload, setHasNewUpload] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = React.useState(false);

  const handleGenerateQuote = async () => {
    const shopName = getValues('shopName');
    const craftIds = getValues('craftIds');

    if (!shopName) {
      toast.error('Please provide a shop name in Step 2 first');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateMakerQuote({ shopName, craftIds });
      if ('success' in result && result.success && 'data' in result) {
        setValue('makerQuote', result.data, { shouldValidate: true, shouldDirty: true });
        toast.success('AI generated a soulful quote for you!');
      } else if ('error' in result) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateStory = async () => {
    const shopName = getValues('shopName');
    const craftIds = getValues('craftIds');
    const firstName = getValues('firstName');
    const lastName = getValues('lastName');
    const artisanName = `${firstName} ${lastName}`.trim();

    if (!shopName) {
      toast.error('Please provide a shop name in Step 2 first');
      return;
    }
    
    if (!artisanName) {
      toast.error('Please provide your name first');
      return;
    }

    setIsGeneratingStory(true);
    try {
      const result = await generateMakerStory({ shopName, craftIds, artisanName });
      if ('success' in result && result.success && 'data' in result) {
        setValue('bio', result.data, { shouldValidate: true, shouldDirty: true });
        toast.success('AI crafted your maker story!');
      } else if ('error' in result) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsGeneratingStory(false);
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
          <ImageUpload
            folder="profiles"
            onUploadComplete={(image) => {
              setValue('avatarUrl', image.url, { shouldValidate: true, shouldDirty: true });
              setValue('avatarPublicId', image.publicId, { shouldValidate: true, shouldDirty: true });
              setHasNewUpload(true);
            }}
            onUploadError={(err) => toast.error(err)}
            currentImageUrl={previewUrl || undefined}
            currentPublicId={watch('avatarPublicId') || undefined}
            isUnsaved={hasNewUpload}
            label="Maker Portrait"
            hint="JPG, PNG or WebP · max 5 MB"
            shape="circle"
            aspectRatio="1/1"
            maxWidth={160}
          />
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
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Maker's Quote</label>
            <button 
              type="button"
              onClick={handleGenerateQuote}
              disabled={isGenerating}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50 text-accent-foreground font-sans text-[9px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <Loader2 size={10} className="animate-spin" />
              ) : (
                <Sparkles size={10} className="animate-pulse" />
              )}
              {isGenerating ? 'Generating...' : 'AI Quote'}
            </button>
          </div>
          
          <div className="relative group">
            <FormTextarea
              control={control}
              name="makerQuote"
              placeholder="I find the soul of the wood in the shavings on the floor."
              rows={1}
              autosize={true}
              className="space-y-0"
              textareaClassName="font-serif italic text-lg md:text-xl px-12 text-center !py-8 h-auto bg-surface-container-low border-surface-container-highest/50 focus:ring-primary/10 focus:border-primary resize-none overflow-hidden"
            />
            <span className="absolute left-6 top-8 font-serif text-4xl text-outline-variant/20 select-none pointer-events-none">“</span>
            <span className="absolute right-6 bottom-8 font-serif text-4xl text-outline-variant/20 select-none pointer-events-none">”</span>
          </div>

          <p className="text-[10px] text-on-surface-variant/70 leading-relaxed px-1 max-w-md italic">
            This quote will appear on your product detail pages to build a personal connection with collectors.
          </p>
        </div>

        {/* Your Story Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <div className="space-y-1">
              <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Your Story</label>
              <p className="text-[10px] text-on-surface-variant leading-tight">Share the intention and journey behind your craft.</p>
            </div>
            <button 
              type="button"
              onClick={handleGenerateStory}
              disabled={isGeneratingStory}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50 text-accent-foreground font-sans text-[9px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingStory ? (
                <Loader2 size={10} className="animate-spin" />
              ) : (
                <Sparkles size={10} className="animate-pulse" />
              )}
              {isGeneratingStory ? 'Generating...' : 'AI Story'}
            </button>
          </div>
          
          <FormTextarea
            control={control}
            name="bio"
            placeholder="Tell your collectors about your journey, your philosophy, and what makes your work intentional..."
            rows={4}
            autosize={true}
            textareaClassName="bg-surface-container-low border-surface-container-highest/50 focus:ring-primary/10 focus:border-primary !py-6"
          />
        </div>
      </div>
        {/* Note on Authenticity */}
        <div className="p-4 md:p-6 bg-surface-container-highest/30 rounded-2xl flex items-start gap-4 border border-outline-variant/10">
          <Verified className="text-primary shrink-0" size={20} />
          <div className="space-y-0.5">
            <h4 className="font-sans text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Note on Authenticity</h4>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              In a world of mass production, your vulnerability is your value. Don&apos;t worry about being perfect; be human. Our community cherishes the stories of failed experiments as much as the final masterpieces.
            </p>
          </div>
        </div>
    </div>
  );
};
