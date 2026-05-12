'use server';

import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { z } from 'zod';
import {
  getSession, encrypt, sessionCookieOptions, SESSION_DURATION_MS,
} from '@/lib/session';
import type { Role } from '@/types/auth';

// Validates data coming from each onboarding step (Buyer or Seller)
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
  makerPortrait: z.string().optional(),
  makerQuote: z.string().optional(),
  story: z.string().optional(),
  showLocation: z.boolean().optional(),
});

export type OnboardingStepData = z.infer<typeof onboardingStepSchema>;
type ActionResult = { success: true } | { success: false; error: string };

export async function saveOnboardingStep(
  step: number,
  data: OnboardingStepData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: 'Unauthorized' };

  const parsed = onboardingStepSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    // Load existing saved data and merge the new step's data into it
    const existing = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: { onboardingData: true },
    });

    const mergedData = {
      ...(existing?.onboardingData as object ?? {}),
      ...parsed.data,
    };

    const nextStep = step + 1;

    await db
      .update(users)
      .set({ currentStep: nextStep, onboardingData: mergedData })
      .where(eq(users.id, session.userId));

    const expires = new Date(Date.now() + SESSION_DURATION_MS);
    const newSession = await encrypt({ ...session, currentStep: nextStep });
    const cookieStore = await cookies();
    cookieStore.set('session', newSession, sessionCookieOptions(expires));

    return { success: true };
  } catch (error) {
    console.error('saveOnboardingStep error:', error);
    return { success: false, error: 'Failed to save progress. Please try again.' };
  }
}

export async function finalizeOnboarding(role: Role): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: 'Unauthorized' };

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: { onboardingData: true },
    });

    const data = (user?.onboardingData ?? {}) as OnboardingStepData;

    // Write all accumulated onboarding data to the actual profile columns
    await db
      .update(users)
      .set({
        isOnboardingComplete: true,
        role,
        firstName: data.firstName ?? null,
        lastName: data.lastName ?? null,
        bio: data.bio ?? null,
      })
      .where(eq(users.id, session.userId));

    // Issue a new JWT with onboardingComplete: true so middleware lets them through
    const expires = new Date(Date.now() + SESSION_DURATION_MS);
    const newSession = await encrypt({
      ...session,
      onboardingComplete: true,
      role,
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
    });
    const cookieStore = await cookies();
    cookieStore.set('session', newSession, sessionCookieOptions(expires));

    return { success: true };
  } catch (error) {
    console.error('finalizeOnboarding error:', error);
    return { success: false, error: 'Failed to complete onboarding. Please try again.' };
  }
}
