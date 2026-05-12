"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormTextarea } from "@/components/form/FormTextarea";
import { Button } from "@/components/ui/Button";
import { BuyerProfileSchema } from "../../schemas/buyer.schema";
import { AtSign, ChevronDown } from "lucide-react";

interface Step2BuyerProfileProps {
  onContinue: () => void;
  onBack: () => void;
  isSaving?: boolean;
}

export const Step2BuyerProfile = ({
  onContinue,
  onBack,
  isSaving,
}: Step2BuyerProfileProps) => {
  const { control, handleSubmit } = useFormContext<BuyerProfileSchema>();

  const countryOptions = [
    { value: "uk", label: "United Kingdom" },
    { value: "fr", label: "France" },
    { value: "it", label: "Italy" },
    { value: "jp", label: "Japan" },
    { value: "us", label: "United States" },
  ];

  return (
    <div className="w-full flex justify-center py-2 md:py-4">
      <div className="w-full max-w-[560px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 md:p-10 relative overflow-hidden border border-outline-variant/10">
        {/* Background Decorative Texture */}
        <div className="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none">
          <img
            alt=""
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida/ADBb0uhDUMnARb7mt-RYEVDZj0NG7BXyyjr9AeKvD0p_93E5A5d6j2OBf-Y9kCoFHLctfCj8NWi6wsje921H-GRXzDRm2h1TJY0wsSYkgXR8k-75A09VsFGcknCNsULtp7uytuLgJbPuJwhYWzX0gQTuq06hPiXYlu2xoHp8HXwfYkuNQzyjnRh46HMvs4PU79vS3QsVq9zpW8v5R7MZMKJKBKvDzukakokIU8S58RNm1IKwcTM5cr5uCarHpfg"
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-serif text-primary mb-2">
              Tell us a little about you
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant max-w-[360px] mx-auto">
              Please provide your details to help us personalize your artisanal
              journey.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onContinue();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                control={control}
                name="firstName"
                label="First Name"
                placeholder="Eleanor"
                inputClassName="h-12 bg-surface-container border-none rounded-lg px-4"
              />
              <FormInput
                control={control}
                name="lastName"
                label="Last Name"
                placeholder="Thorne"
                inputClassName="h-12 bg-surface-container border-none rounded-lg px-4"
              />
            </div>

            <FormTextarea
              control={control}
              name="bio"
              label="Bio"
              placeholder="Tell us about your love for handmade crafts..."
              textareaClassName="bg-surface-container border-none rounded-lg"
              rows={3}
            />

            {/* Country Dropdown */}
            <FormSelect
              control={control}
              name="country"
              label="Country"
              placeholder="Select your location"
              options={countryOptions}
            />

            {/* Birthday with curating info */}
            <div className="space-y-1">
              <FormInput
                control={control}
                name="birthday"
                label="Birthday"
                type="date"
                inputClassName="h-12 bg-surface-container border-none rounded-lg px-4"
              />

              {/* AI Guide Style Note */}
              <div className="mt-3 p-3 rounded-xl bg-tertiary-fixed/20 flex items-start gap-2 border border-tertiary-fixed-dim/10">
                <span
                  className="material-symbols-outlined text-tertiary text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
                <p className="text-[10px] md:text-xs text-tertiary-fixed-variant italic font-serif leading-relaxed">
                  "Help us curate seasonal recommendations based on your local
                  cycle."
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                shape="rounded"
                disabled={isSaving}
                className="w-full h-12 shadow-lg shadow-primary/10"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-[9px] font-bold uppercase tracking-widest text-outline hover:text-primary transition-colors underline decoration-outline-variant underline-offset-4"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
