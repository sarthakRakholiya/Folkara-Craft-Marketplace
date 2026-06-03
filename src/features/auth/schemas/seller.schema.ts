import { z } from "zod";

export const sellerProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  bio: z.string().min(10, "Bio should be at least 10 characters"),
  avatarUrl: z.string().url().nullable().optional(),
  avatarPublicId: z.string().nullable().optional(),
  makerQuote: z.string().max(300, "Quote is too long").nullable().optional(),
  
  // Location & Identity
  country: z.string().min(1, "Country is required"),
  city: z.string().optional(),
  birthday: z.string().nullable().optional().refine((date) => {
    if (!date) return true;
    return new Date(date) <= new Date();
  }, { message: "Birthday cannot be in the future" }),
  
  // Shop fields
  shopName: z.string().min(2, "Shop name is too short"),
  logoUrl: z.string().url().nullable().optional(),
  logoPublicId: z.string().nullable().optional(),
});

export type SellerProfileInput = z.infer<typeof sellerProfileSchema>;
