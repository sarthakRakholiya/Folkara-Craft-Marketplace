import { z } from 'zod';

export type Role = 'BUYER' | 'SELLER';

export interface SessionPayload {
  userId: string;           // DB user id
  role: Role;               // 'BUYER' | 'SELLER'
  onboardingComplete: boolean;
  currentStep: number;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  shopName?: string | null;
}

// ── Signup schema ─────────────────────────────────────────────────────────────
export const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: z.enum(['BUYER', 'SELLER']).default('BUYER'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ── Login schema ──────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// TypeScript types derived from the schemas
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
