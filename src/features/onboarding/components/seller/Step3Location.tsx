"use client";

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { LocationSchema } from '../../types/onboarding.types';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import { FormInput } from '@/components/form/FormInput';
import { FormSelect } from '@/components/form/FormSelect';
import { FormSwitch } from '@/components/form/FormSwitch';

const COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'JP', label: 'Japan' },
  { value: 'FR', label: 'France' },
  { value: 'IT', label: 'Italy' },
  { value: 'IN', label: 'India' },
  { value: 'DE', label: 'Germany' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
];

export const Step3Location = () => {
  const { control, watch } = useFormContext<LocationSchema>();
  
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-8 pb-4">
      {/* Content Header */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-2xl md:text-4xl text-primary leading-tight">Where are you based?</h1>
        <p className="font-sans text-base md:text-lg text-on-surface-variant italic font-serif max-w-md mx-auto">
          "Every object carries the spirit of its landscape. Tell us where your story begins."
        </p>
      </div>

      {/* Form Section */}
      <div className="w-full bg-surface-container-low p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/10 space-y-8">
        <div className="space-y-6">
          {/* Country Dropdown */}
          <FormSelect
            control={control}
            name="country"
            label="Country"
            placeholder="Select your country"
            options={COUNTRY_OPTIONS}
            variant="default"
          />

          {/* City Field */}
          <FormInput
            control={control}
            name="city"
            label="City (Optional)"
            placeholder="e.g. Kyoto, Portland, Provence"
            variant="default"
            inputClassName="!py-3"
          />

          {/* Toggle Section */}
          <FormSwitch
            control={control}
            name="showLocation"
            label="Show location on my shop"
            description="Allow customers to see your workshop's region to build local connection."
            className="pt-4 border-t border-outline-variant/10"
          />
        </div>
      </div>

      {/* Decorative AI Note */}
      <div className="flex items-center justify-center gap-4 py-4 px-8 rounded-2xl bg-secondary-container/10 border border-secondary-container/20 max-w-lg">
        <span className="material-symbols-outlined text-secondary text-2xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
          auto_awesome
        </span>
        <p className="font-sans text-xs text-on-secondary-fixed-variant italic leading-relaxed">
          Artisan communities thrive on transparency. Sharing your location helps collectors find your workshop.
        </p>
      </div>
    </div>
  );
};
