"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Globe,
  Loader2,
  Sparkles,
  Store,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import { updateSellerProfile } from "@/features/auth/actions/profile.actions";
import { sellerProfileSchema, type SellerProfileInput } from "@/features/auth/schemas/seller.schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { generateMakerQuote, generateMakerStory } from "@/features/aiAssistant/actions/ai.actions";

interface SellerProfileViewData {
  id: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  avatarPublicId: string | null;
  makerQuote: string | null;
  country: string | null;
  city: string | null;
  createdAt: Date;
  shopName?: string;
  logoUrl?: string | null;
  logoPublicId?: string | null;
  shopId?: string | null;
}

interface ProfileViewProps {
  initialData: SellerProfileViewData;
}

export function ProfileView({ initialData }: ProfileViewProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<SellerProfileInput>({
    resolver: zodResolver(sellerProfileSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      bio: initialData?.bio || "",
      avatarUrl: initialData?.avatarUrl || "",
      avatarPublicId: initialData?.avatarPublicId || "",
      makerQuote: initialData?.makerQuote || "",
      shopName: initialData?.shopName || "",
      logoUrl: initialData?.logoUrl || "",
      logoPublicId: initialData?.logoPublicId || "",
      country: initialData?.country || "",
      city: initialData?.city || "",
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { isDirty },
    control,
  } = form;

  const avatarUrl = watch("avatarUrl");
  const avatarPublicId = watch("avatarPublicId");
  const logoUrl = watch("logoUrl");
  const logoPublicId = watch("logoPublicId");

  const onSubmit = async (data: SellerProfileInput) => {
    setIsSaving(true);
    try {
      const result = await updateSellerProfile(data);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Profile updated successfully");
        queryClient.invalidateQueries({ queryKey: ["session"] });
        router.refresh();
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateQuote = async () => {
    const shopName = getValues("shopName");
    if (!shopName) {
      toast.error("Please provide a shop name first");
      return;
    }

    setIsGeneratingQuote(true);
    try {
      const result = await generateMakerQuote(shopName, []);
      if (result.success && result.quote) {
        setValue("makerQuote", result.quote, { shouldDirty: true });
        toast.success("AI generated a quote for you!");
      } else {
        toast.error(result.error || "Failed to generate quote");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsGeneratingQuote(false);
    }
  };

  const handleGenerateStory = async () => {
    const shopName = getValues("shopName");
    const firstName = getValues("firstName");
    const lastName = getValues("lastName");
    const artisanName = `${firstName} ${lastName}`.trim();

    if (!shopName || !artisanName) {
      toast.error("Please provide shop name and your name first");
      return;
    }

    setIsGeneratingStory(true);
    try {
      const result = await generateMakerStory(shopName, [], artisanName);
      if (result.success && result.story) {
        setValue("bio", result.story, { shouldDirty: true });
        toast.success("AI crafted your maker story!");
      } else {
        toast.error(result.error || "Failed to generate story");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsGeneratingStory(false);
    }
  };

  return (
    <div className="px-margin-page py-16 max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="font-display-lg text-4xl text-primary mb-2">Artisan Profile</h1>
        <p className="font-body-lg text-outline italic">
          Refine your story and shop identity.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12">
        {/* Top Section: Avatar & Identity */}
        <section className="bg-white rounded-3xl border border-outline-variant/10 p-8 md:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/3 flex flex-col items-center">
              <div className="group">
                <ImageUpload
                  folder="profiles"
                  shape="circle"
                  aspectRatio="1/1"
                  maxWidth={200}
                  currentImageUrl={avatarUrl || undefined}
                  currentPublicId={avatarPublicId || undefined}
                  onUploadComplete={(img) => {
                    setValue("avatarUrl", img.url, { shouldDirty: true });
                    setValue("avatarPublicId", img.publicId, { shouldDirty: true });
                  }}
                  onUploadError={(err) => toast.error(err)}
                  label=""
                  hideLabel
                />
              </div>
              <p className="font-label-caps text-[10px] text-outline mt-8 text-center tracking-widest uppercase">
                Identity verified since{" "}
                {initialData.createdAt
                  ? new Date(initialData.createdAt).getFullYear()
                  : "2024"}
              </p>
            </div>

            <div className="flex-1 w-full space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  control={control}
                  name="firstName"
                  label="First Name"
                  placeholder="e.g. Elias"
                />
                <FormInput
                  control={control}
                  name="lastName"
                  label="Last Name"
                  placeholder="e.g. Thorne"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-label-caps text-[10px] text-secondary tracking-[0.3em] font-bold uppercase">
                    Your Maker Story
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateStory}
                    disabled={isGeneratingStory}
                    className="flex items-center gap-2 text-[9px] font-label-caps text-accent-foreground bg-accent/30 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                  >
                    {isGeneratingStory ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                    AI STORY
                  </button>
                </div>
                <FormTextarea
                  control={control}
                  name="bio"
                  placeholder="Tell your story..."
                  rows={6}
                  autosize={true}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="bg-white rounded-3xl border border-outline-variant/10 p-8 md:p-12 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
              <Globe size={20} />
            </div>
            <h2 className="font-display-sm text-xl text-primary">Location</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormInput
              control={control}
              name="country"
              label="Country"
              placeholder="e.g. United Kingdom"
            />
            <FormInput
              control={control}
              name="city"
              label="City"
              placeholder="e.g. London"
            />
          </div>
        </section>

        {/* Middle Section: Maker Quote */}
        <section className="bg-white rounded-3xl border border-outline-variant/10 p-8 md:p-12 shadow-sm">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="font-label-caps text-[10px] text-secondary tracking-[0.3em] font-bold uppercase px-1">
                Signature Quote
              </span>
              <button
                type="button"
                onClick={handleGenerateQuote}
                disabled={isGeneratingQuote}
                className="flex items-center gap-2 text-[9px] font-label-caps text-accent-foreground bg-accent/30 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all disabled:opacity-50"
              >
                {isGeneratingQuote ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                AI QUOTE
              </button>
            </div>
            
            <div className="relative">
              <FormTextarea
                control={control}
                name="makerQuote"
                placeholder="I find the soul of the wood in the shavings on the floor."
                rows={3}
                autosize={true}
                className="text-center font-serif italic text-lg md:text-xl py-12 px-16"
              />
              <Quote className="absolute left-6 top-10 text-outline-variant/20" size={24} />
              <Quote className="absolute right-6 bottom-10 text-outline-variant/20 rotate-180" size={24} />
            </div>
          </div>
        </section>

        {/* Bottom Section: Shop Identity */}
        <section className="bg-white rounded-3xl border border-outline-variant/10 p-8 md:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="w-full md:w-1/3 flex flex-col items-center">
            
              <div className="max-w-[200px] w-full">
                <ImageUpload
                  folder="shops/logos"
                  shape="rectangle"
                  aspectRatio="1/1"
                  currentImageUrl={logoUrl || undefined}
                  currentPublicId={logoPublicId || undefined}
                  onUploadComplete={(img) => {
                    setValue("logoUrl", img.url, { shouldDirty: true });
                    setValue("logoPublicId", img.publicId, { shouldDirty: true });
                  }}
                  onUploadError={(err) => toast.error(err)}
                />
              </div>
            </div>

            <div className="flex-1 w-full space-y-8">
              <FormInput
                control={control}
                name="shopName"
                label="Shop Name"
                placeholder="e.g. Hearth & Earth Pottery"
                startIcon={
                  <Store className="text-outline/40" size={18} />
                }
              />

              <div className="p-6 bg-surface-container-high/30 rounded-2xl border border-outline-variant/5">
                <p className="font-body-sm text-outline italic leading-relaxed">
                  &ldquo;Your shop identity is the bridge between your craft and the world.
                  A strong brand builds trust with collectors.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final Actions */}
        <footer className="flex justify-end items-center gap-8 pt-12 border-t border-outline-variant/10">
          <Button
            type="button"
            variant="outline"
            size="lg"
            shape="rounded"
            onClick={() => router.back()}
            className="px-10 h-16 text-xs tracking-[0.2em]"
          >
            CANCEL CHANGES
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            shape="rounded"
            className="px-16 h-16 shadow-2xl shadow-primary/20 text-xs tracking-[0.2em]"
            disabled={isSaving || !isDirty}
          >
            {isSaving ? "SAVING..." : "SAVE PROFILE"}
          </Button>
        </footer>
      </form>
    </div>
  );
}
