"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import {
  buyerProfileSchema,
  type BuyerProfileSchema,
} from "@/features/onboarding/schemas/buyer.schema";
import { useQueryClient } from "@tanstack/react-query";
import { updateBuyerProfile } from "@/features/auth/actions/profile.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { User } from "@/db/schemas/users.schema";
import { CRAFT_OPTIONS } from "@/features/onboarding/constants/onboarding.constants";
import { cn } from "@/lib/utils";
import type { BuyerProfileViewData } from "../types/profile.types";


interface ProfileViewProps {
  initialData: BuyerProfileViewData;
}

export function ProfileView({ initialData }: ProfileViewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const onboardingData = initialData.onboardingData || {};

  const form = useForm<BuyerProfileSchema>({
    resolver: zodResolver(buyerProfileSchema),
    defaultValues: {
      firstName: initialData.firstName || onboardingData.firstName || "",
      lastName: initialData.lastName || onboardingData.lastName || "",
      bio: initialData.bio || onboardingData.bio || "",
      country: onboardingData.country || "United Kingdom",
      birthday: onboardingData.birthday || "",
      interests:
        onboardingData.interests && onboardingData.interests.length > 0
          ? onboardingData.interests
          : [],
      avatarUrl: initialData.avatarUrl || onboardingData.avatarUrl || "",
      avatarPublicId:
        initialData.avatarPublicId || onboardingData.avatarPublicId || "",
    },
  });

  const onSubmit = async (data: BuyerProfileSchema) => {
    setIsSaving(true);
    try {
      const result = await updateBuyerProfile(data);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Profile updated successfully");
        queryClient.invalidateQueries({ queryKey: ["session"] });
        router.refresh();
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedInterests = form.watch("interests") || [];

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      form.setValue(
        "interests",
        selectedInterests.filter((i) => i !== id),
        { shouldDirty: true },
      );
    } else {
      form.setValue("interests", [...selectedInterests, id], {
        shouldDirty: true,
      });
    }
  };

  return (
    <main className="px-margin-page pt-16 pb-40 max-w-6xl mx-auto">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-24"
      >
        {/* Hero Profile Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="group">
              <ImageUpload
                folder="profiles"
                shape="circle"
                currentImageUrl={form.watch("avatarUrl") || undefined}
                currentPublicId={form.watch("avatarPublicId") || undefined}
                onUploadComplete={(img) => {
                  form.setValue("avatarUrl", img.url, { shouldDirty: true });
                  form.setValue("avatarPublicId", img.publicId, {
                    shouldDirty: true,
                  });
                }}
                onUploadError={(err) => toast.error(err)}
                label=""
                hideLabel
                trigger={
                  <div className="bg-primary text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer border-4 border-white">
                    <Camera size={24} />
                  </div>
                }
              />
            </div>
            <p className="font-label-caps text-[10px] text-outline mt-8 text-center tracking-widest uppercase">
              Identity verified since{" "}
              {initialData.createdAt
                ? new Date(initialData.createdAt).getFullYear()
                : "2024"}
            </p>
          </div>

          <div className="md:col-span-8 flex flex-col gap-4 pt-4">
            <div className="space-y-1">
              <span className="font-label-caps text-[10px] text-secondary tracking-[0.3em] font-bold uppercase">
                Personal Identity
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <FormInput
                control={form.control}
                name="firstName"
                label="First Name"
                placeholder="Julian"
              />
              <FormInput
                control={form.control}
                name="lastName"
                label="Last Name"
                placeholder="Thorne"
              />
              <div className="md:col-span-2">
                <div className="group">
                  <label className="text-[10px] tracking-widest font-semibold uppercase text-on-surface-variant block px-1 mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={initialData.email}
                    disabled
                    className="w-full h-12 bg-surface-container-low border border-surface-container-highest/30 rounded-lg px-4 text-sm text-outline opacity-70 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <FormTextarea
                  control={form.control}
                  name="bio"
                  label="The Maker's Quote"
                  placeholder="I seek beauty in the imperfect..."
                  rows={4}
                />
                <p className="font-label-caps text-[10px] text-outline-variant mt-3 tracking-widest uppercase">
                  This philosophy is shared with artisans when you acquire their
                  work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Preferences & Status */}
        <section className="grid grid-cols-1 gap-8">
          <div className="bg-surface-container-low p-10 rounded-2xl flex flex-col gap-8 border border-outline-variant/10">
            <div className="flex justify-between items-center">
              <h4 className="font-headline-sm text-2xl text-primary">
                Curation Preferences
              </h4>
              <span className="font-label-caps text-[10px] text-outline tracking-widest uppercase">
                {selectedInterests.length} SELECTED
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {CRAFT_OPTIONS.map((craft) => {
                const isSelected = selectedInterests.includes(craft.id);
                return (
                  <button
                    key={craft.id}
                    type="button"
                    onClick={() => toggleInterest(craft.id)}
                    className={cn(
                      "px-6 py-3 rounded-full font-label-caps text-[10px] tracking-widest flex items-center gap-2 transition-all",
                      isSelected
                        ? "bg-secondary text-white border border-secondary"
                        : "bg-white border border-outline-variant/30 text-outline hover:border-secondary/30 hover:text-secondary",
                    )}
                  >
                    {craft.name.toUpperCase()}
                    {isSelected ? <X size={14} /> : <Plus size={14} />}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final Actions - Mac Dock Style */}
        <div className="fixed bottom-8 left-0 right-0 lg:left-72 flex justify-center pointer-events-none z-50">
          <footer className="pointer-events-auto flex items-center gap-4 px-6 py-4 bg-white/70 backdrop-blur-xl border border-outline-variant/20 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-in slide-in-from-bottom-8 duration-700 mx-4">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              shape="rounded"
              onClick={() => form.reset()}
              className="px-8 h-12 text-[10px] tracking-[0.2em] font-bold text-outline hover:text-primary transition-colors"
            >
              RESET
            </Button>
            <div className="w-[1px] h-8 bg-outline-variant/30 mx-2" />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              shape="rounded"
              className="px-10 h-12 shadow-lg shadow-primary/20 text-[10px] tracking-[0.2em] font-bold"
              disabled={isSaving}
            >
              {isSaving ? "SAVING..." : "SAVE PROFILE"}
            </Button>
          </footer>
        </div>
      </form>
    </main>
  );
}
