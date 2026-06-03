"use server";

import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { setSession } from '@/lib/session';
import type { Role } from '@/types/auth';
import { withAuthAction, withAuthQuery } from '@/lib/actionMiddleware';

// Validates data coming from each onboarding step
const onboardingStepSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  birthday: z.string().optional(),
  interests: z.array(z.string()).optional(),
  craftIds: z.array(z.string()).optional(),
  customCraft: z.string().optional(),
  shopName: z.string().optional(),
  logoUrl: z.string().optional(),
  avatarUrl: z.string().optional(),
  avatarPublicId: z.string().optional(),
  makerQuote: z.string().optional(),
  showLocation: z.boolean().optional(),
  shopId: z.string().optional(),
});

export type OnboardingStepData = z.infer<typeof onboardingStepSchema>;

/**
 * Saves progress of an onboarding step.
 */
export const saveOnboardingStep = withAuthAction(
  async ({ session }, { step, data }: { step: number; data: OnboardingStepData }) => {
    const existing = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: { onboardingData: true },
    });

    const mergedData = {
      ...(existing?.onboardingData as object ?? {}),
      ...data,
    };

    const nextStep = step + 1;

    await db
      .update(users)
      .set({ currentStep: nextStep, onboardingData: mergedData })
      .where(eq(users.id, session.userId));

    await setSession({ 
      ...session, 
      currentStep: nextStep,
      firstName: mergedData.firstName ?? session.firstName ?? null,
      lastName: mergedData.lastName ?? session.lastName ?? null,
      avatarUrl: mergedData.avatarUrl ?? session.avatarUrl ?? null,
      // @ts-ignore - shopName may not be strictly typed in session but we can store it
      shopName: mergedData.shopName ?? (session as any).shopName ?? null,
    });

    return { success: true };
  }
);

/**
 * Finalizes onboarding and marks it as complete.
 */
export const finalizeOnboarding = withAuthAction(
  async ({ session }, role: Role) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: { onboardingData: true },
    });

    const data = (user?.onboardingData ?? {}) as OnboardingStepData;

    await db
      .update(users)
      .set({
        isOnboardingComplete: true,
        role,
        firstName: data.firstName ?? null,
        lastName: data.lastName ?? null,
        bio: data.bio ?? null,
        avatarUrl: data.avatarUrl ?? null,
        avatarPublicId: data.avatarPublicId ?? null,
      })
      .where(eq(users.id, session.userId));

    await setSession({
      ...session,
      onboardingComplete: true,
      role,
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      avatarUrl: data.avatarUrl ?? null,
    });

    return { success: true };
  }
);

/**
 * Fetches current onboarding data.
 */
export const getOnboardingData = withAuthQuery(
  async ({ session }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: { 
        onboardingData: true,
        firstName: true,
        lastName: true,
        bio: true,
        avatarUrl: true,
        avatarPublicId: true,
      },
    });

    if (!user) return null;

    return {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      bio: user.bio || '',
      avatarUrl: user.avatarUrl || '',
      avatarPublicId: user.avatarPublicId || '',
      ...(user.onboardingData as object ?? {}),
    } as OnboardingStepData;
  }
);
