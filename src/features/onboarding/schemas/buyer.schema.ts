import { z } from 'zod';

export const buyerProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  country: z.string().min(1, 'Please select your country'),
  birthday: z.string().min(1, 'Birthday is required').refine((date) => new Date(date) <= new Date(), { message: 'Birthday cannot be in the future' }),
  interests: z.array(z.string()).optional(),
  avatarUrl: z.string().optional(),
  avatarPublicId: z.string().optional(),
});

export type BuyerProfileSchema = z.infer<typeof buyerProfileSchema>;
