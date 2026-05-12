import { z } from 'zod';

export const buyerProfileSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  country: z.string().min(1, 'Please select your country'),
  birthday: z.string().min(1, 'Birthday is required'),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
});

export type BuyerProfileSchema = z.infer<typeof buyerProfileSchema>;
