import { z } from 'zod';

export const craftSelectionSchema = z.object({
  craftIds: z.array(z.string()).min(1, 'Please select at least one craft'),
  customCraft: z.string().optional(),
});

export type CraftSelectionSchema = z.infer<typeof craftSelectionSchema>;

export const shopNameSchema = z.object({
  shopName: z.string().min(3, 'Shop name must be at least 3 characters'),
  logoUrl: z.string().optional(),
});

export type ShopNameSchema = z.infer<typeof shopNameSchema>;

export const locationSchema = z.object({
  country: z.string().min(1, 'Please select your country'),
  city: z.string().optional(),
  showLocation: z.boolean().default(true),
});

export type LocationSchema = z.infer<typeof locationSchema>;

export const artisanProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  makerPortrait: z.string().optional(),
  makerQuote: z.string().optional(),
  story: z.string().min(20, 'Please tell us a bit more about your story (min 20 characters)'),
});

export type ArtisanProfileSchema = z.infer<typeof artisanProfileSchema>;

export type OnboardingData = {
  step1: CraftSelectionSchema;
  step2: ShopNameSchema;
  step3: LocationSchema;
  step4: ArtisanProfileSchema;
};

export type CraftOption = {
  id: string;
  name: string;
  category: string;
  icon: string;
};
