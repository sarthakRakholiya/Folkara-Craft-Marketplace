import { z } from 'zod';

export const buyerProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  country: z.string().min(1, 'Please select your country'),
  birthday: z.string().min(1, 'Birthday is required'),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
});

export type BuyerProfileSchema = z.infer<typeof buyerProfileSchema>;
