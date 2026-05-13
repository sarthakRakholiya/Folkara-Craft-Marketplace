'use server';

import { db } from '@/lib/db';
import { users, shops } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession, setSession } from '@/lib/session';
import { deleteImage } from '@/lib/cloudinary';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { buyerProfileSchema } from '@/features/onboarding/schemas/buyer.schema';
import { sellerProfileSchema } from '../schemas/seller.schema';
import { changePasswordSchema } from '../schemas/password.schema';

const imageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
});

type ActionResult = { success: true } | { error: string };
type SellerOnboardingData = Partial<{
  firstName: string;
  lastName: string;
  bio: string;
  country: string;
  city: string;
  makerQuote: string;
  avatarUrl: string | null;
  avatarPublicId: string | null;
  shopName: string;
  logoUrl: string | null;
  logoPublicId: string | null;
  shopId: string | null;
}>;
type BuyerOnboardingData = Partial<{
  firstName: string;
  lastName: string;
  bio: string;
  country: string;
  birthday: string;
  interests: string[];
  avatarUrl: string;
  avatarPublicId: string;
}>;

export async function updateProfilePicture(
  data: z.infer<typeof imageSchema>
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const parsed = imageSchema.safeParse(data);
  if (!parsed.success) return { error: 'Invalid image data' };

  try {
    // Load existing publicId so we can delete the old image if needed
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: { avatarPublicId: true },
    });

    // For profiles we use userId as the publicId so Cloudinary already
    // overwrites the same file on re-upload. The delete is a safety net.
    if (user?.avatarPublicId && user.avatarPublicId !== parsed.data.publicId) {
      await deleteImage(user.avatarPublicId);
    }

    await db
      .update(users)
      .set({
        avatarUrl: parsed.data.url,
        avatarPublicId: parsed.data.publicId,
      })
      .where(eq(users.id, session.userId));

    return { success: true };
  } catch {
    return { error: 'Failed to update profile picture. Please try again.' };
  }
}

export async function updateBuyerProfile(
  data: z.infer<typeof buyerProfileSchema>
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const parsed = buyerProfileSchema.safeParse(data);
  if (!parsed.success) return { error: 'Invalid profile data' };

  try {
    const existing = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: { onboardingData: true },
    });

    const onboardingData = (existing?.onboardingData || {}) as BuyerOnboardingData;

    await db
      .update(users)
      .set({
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        bio: parsed.data.bio,
        avatarUrl: parsed.data.avatarUrl,
        avatarPublicId: parsed.data.avatarPublicId,
        onboardingData: {
          ...onboardingData,
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          bio: parsed.data.bio,
          country: parsed.data.country,
          birthday: parsed.data.birthday,
          interests: parsed.data.interests,
          avatarUrl: parsed.data.avatarUrl,
          avatarPublicId: parsed.data.avatarPublicId,
        },
      })
      .where(eq(users.id, session.userId));

    // Update session
    await setSession({
      ...session,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      avatarUrl: parsed.data.avatarUrl,
      shopName: parsed.data.shopName,
    });

    return { success: true };
  } catch (err) {
    console.error('Update profile error:', err);
    return { error: 'Failed to update profile. Please try again.' };
  }
}

export async function getBuyerProfile() {
  const session = await getSession();
  if (!session) return null;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
    });

    if (!user) return null;

    return user;
  } catch (err) {
    console.error('Get profile error:', err);
    return null;
  }
}

export async function changePassword(
  data: z.infer<typeof changePasswordSchema>
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const parsed = changePasswordSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: { password: true },
    });

    if (!user) return { error: "User not found" };

    const isMatch = await bcrypt.compare(
      parsed.data.currentPassword,
      user.password
    );
    if (!isMatch) return { error: "Incorrect current password" };

    const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 12);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, session.userId));

    return { success: true };
  } catch (err) {
    console.error("Change password error:", err);
    return { error: "Failed to update password. Please try again." };
  }
}

export async function getSellerProfile() {
  const session = await getSession();
  if (!session) return null;

  try {
    const [user] = await db
      .select({
        id: users.id,
        onboardingData: users.onboardingData,
        firstName: users.firstName,
        lastName: users.lastName,
        bio: users.bio,
        avatarUrl: users.avatarUrl,
        avatarPublicId: users.avatarPublicId,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) return null;

    let shop = null;
    try {
      shop = await db.query.shops.findFirst({
        where: eq(shops.userId, user.id),
      });
    } catch (err) {
      console.error("Get seller shop error:", err);
    }

    const onboardingData = (user.onboardingData || {}) as SellerOnboardingData;

    return {
      ...user,
      firstName: user.firstName ?? onboardingData.firstName ?? "",
      lastName: user.lastName ?? onboardingData.lastName ?? "",
      bio: user.bio ?? onboardingData.bio ?? "",
      country: onboardingData.country ?? "",
      city: onboardingData.city ?? "",
      makerQuote: onboardingData.makerQuote ?? "",
      avatarUrl: user.avatarUrl ?? onboardingData.avatarUrl ?? null,
      avatarPublicId: user.avatarPublicId ?? onboardingData.avatarPublicId ?? null,
      
      shopName: shop?.name ?? onboardingData.shopName ?? "",
      logoUrl: shop?.logoUrl ?? onboardingData.logoUrl ?? null,
      logoPublicId: shop?.logoPublicId ?? onboardingData.logoPublicId ?? null,
      shopId: shop?.id ?? onboardingData.shopId ?? null,
    };
  } catch (err) {
    console.error("Get seller profile error:", err);
    return null;
  }
}

export async function updateSellerProfile(
  data: z.infer<typeof sellerProfileSchema>
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const parsed = sellerProfileSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid profile data" };

  try {
    const existing = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: { onboardingData: true },
    });

    const onboardingData = (existing?.onboardingData || {}) as SellerOnboardingData;

    // Update user info
    await db
      .update(users)
      .set({
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        bio: parsed.data.bio,
        avatarUrl: parsed.data.avatarUrl,
        avatarPublicId: parsed.data.avatarPublicId,
        onboardingData: {
          ...onboardingData,
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          bio: parsed.data.bio,
          avatarUrl: parsed.data.avatarUrl,
          avatarPublicId: parsed.data.avatarPublicId,
          makerQuote: parsed.data.makerQuote,
          country: parsed.data.country,
          city: parsed.data.city,
        },
      })
      .where(eq(users.id, session.userId));

    // Update shop info
    await db
      .update(shops)
      .set({
        name: parsed.data.shopName,
        logoUrl: parsed.data.logoUrl,
        logoPublicId: parsed.data.logoPublicId,
      })
      .where(eq(shops.userId, session.userId));

    // Update session
    await setSession({
      ...session,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      avatarUrl: parsed.data.avatarUrl,
      shopName: parsed.data.shopName,
    });

    return { success: true };
  } catch (err) {
    console.error("Update seller profile error:", err);
    return { error: "Failed to update profile. Please try again." };
  }
}
