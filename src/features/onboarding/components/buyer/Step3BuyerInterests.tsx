"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { CRAFT_OPTIONS } from "../../constants/onboarding.constants";
import { BuyerProfileSchema } from "../../schemas/buyer.schema";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step3BuyerInterestsProps {
  onContinue: () => void;
  onBack: () => void;
  isSaving?: boolean;
}

export const Step3BuyerInterests = ({
  onContinue,
  onBack,
  isSaving,
}: Step3BuyerInterestsProps) => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BuyerProfileSchema>();

  const selectedInterests = watch("interests") || [];

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setValue(
        "interests",
        selectedInterests.filter((item) => item !== id),
        { shouldValidate: true },
      );
    } else {
      setValue("interests", [...selectedInterests, id], {
        shouldValidate: true,
      });
    }
  };

  // Mock inspirations based on selection (as shown in design)
  const inspirations = [
    {
      alt: "Handmade gifts selection",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPSH1CJi9XN6Op3CXmWAWpPgt6n1jd3vusq7Z3ZtYhxF6KAMiisiKVH8Fxzw1KNIB-fNXVGelZoeoPZqfj1wtAQvTnpMEsvBSM7SJuapFxwL0oWjvM6Yjp5bfh9dmFeA2AfpIMuUxvIK1XSClod3Ps7NNLaxB77_vkc451WdELaB0ydjH5T4UczMNTm15JrI5O-LI4A4Sg_-lQpNO5KstJjODIdpH0eLdweOL4Rcg7-quqs9N7evXBE0HYicc2m-L4zwMkt62QcNo",
    },
    {
      alt: "Art pieces context",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQnB9y2-AwTkUL1ESkJe0NDPAOnA9UYBI-NJM-lZmlHtW5lfWk6jJsOw63ZKr-5PCtnoxSioU1FhtbCOY7y5_l8sf1uDNw8buOkvb0EJKvdsrVrzrDCrJL8erPYmvRSv5TwY3lPJxebYcAtOTIIWr_ma-6NpH8nphVeLNKvV_zuMuUu3jv3Y6jf9J_Ltsx-9L1Z2H_rPGaL5qQBliAelU73yFOEU_uZ3u4_PQhrMik1u8yHTcSpTZZuSz58Bf-7PoDuRiuG0209X8",
    },
    {
      alt: "Ceramics teaser",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGdaTT6LcXg8m4UBYKIS8jGTKENXOtxFXDI2G9xeZWMMnzB-DD8dOzmLtqQ48ggyzjT5P3Wd_3LtPxdBUBTafYNuUeXgue1Cu1hy7nGp7UliFdbOU8lW0kal3sWDvQDC5EcBnarkiM4QxUXLsRC_y_lzFgViV3KmBR69XqYGmfZ-UDpznLhAhJNqZDHkC-CPT1UY181TOUdlkEGT6XmZ3xeuKw8RSwvvxG_S2OoBS058nhmXzzIgq-lwJKqn2hTMl0Y-Lorl7Ow6Q",
    },
    {
      alt: "Home decor inspiration",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8V8Uqt1UpIuOmZMpJlPx8BUZzGr8_MMNs180ZTMmmhTd9UUWHj9VUX452Ygm5qK7bVylMLAeYMUrz2Feb8HRYpoOgT9eki50BTmdFERmHO4wAoa8KWFK7gRmdDqDiLJDSaqq0Q8U8i2mfg-uZe0A6XGVJCSHVWhUvtvsFIO78kKASC83_lGVJAucLVERItsED-zyh4JXITkvis25WRZuKsTTLPeCNOMCKhDe3DMvOmQWyFnbnjMWZHia8NQn3-5eUIM0Ec9YHOUM",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <header className="mb-10">
        <h1 className="text-3xl md:text-display-lg text-on-surface mb-3">
          What are you most interested in?
        </h1>
        <p className="text-sm md:text-body-lg text-on-surface-variant max-w-2xl">
          Choose as many as you like. We’ll tailor your discovery feed based on
          these crafts.
        </p>
      </header>

      {/* Selection Grid */}
      <section className="flex flex-wrap gap-3 mb-12">
        {CRAFT_OPTIONS.map((craft) => {
          const isSelected = selectedInterests.includes(craft.id);
          return (
            <button
              key={craft.id}
              onClick={() => toggleInterest(craft.id)}
              className={cn(
                "px-5 py-2.5 rounded-full border transition-all duration-300 text-xs md:text-sm flex items-center gap-2",
                isSelected
                  ? "border-primary-container bg-primary-container text-on-primary-container shadow-sm"
                  : "border-outline-variant bg-surface hover:bg-primary-fixed hover:border-primary-fixed-dim text-on-surface",
              )}
            >
              {craft.name}
              {isSelected && <Check size={14} />}
            </button>
          );
        })}
      </section>

      {errors.interests && (
        <p className="mb-8 text-error text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
          {errors.interests.message}
        </p>
      )}

      {/* Navigation Actions */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-outline-variant/30">
        <button
          onClick={onContinue} // Skip just goes to next for now as per design "Continue to Final Step"
          className="text-xs md:text-sm font-bold text-on-surface-variant hover:text-primary transition-colors underline decoration-outline-variant/40 underline-offset-8 uppercase tracking-widest"
        >
          Skip for now
        </button>
        <div className="flex gap-4 w-full sm:w-auto">
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            shape="rounded"
            className="flex-1 sm:flex-none"
          >
            Go Back
          </Button>
          <Button
            onClick={onContinue}
            size="lg"
            shape="rounded"
            disabled={isSaving}
            className="flex-1 sm:flex-none shadow-lg shadow-primary/10"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              "Continue to Final Step"
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
};
