import { z } from "zod";

export const sellerProfileSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  bio: z.string().min(10, "Bio should be at least 10 characters"),
  avatarUrl: z.string().url().nullable().optional(),
  avatarPublicId: z.string().nullable().optional(),
  makerQuote: z.string().max(300, "Quote is too long").nullable().optional(),
  
  // Location & Identity
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  birthday: z.string().nullable().optional(),
  
  // Shop fields
  shopName: z.string().min(2, "Shop name is too short"),
  logoUrl: z.string().url().nullable().optional(),
  logoPublicId: z.string().nullable().optional(),
});

export type SellerProfileInput = z.infer<typeof sellerProfileSchema>;
