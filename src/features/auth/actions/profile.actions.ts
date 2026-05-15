"use server";

import { db } from '@/lib/db';
import { users, shops } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { setSession } from '@/lib/session';
import { deleteImage } from '@/lib/cloudinary';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { buyerProfileSchema } from '@/features/onboarding/schemas/buyer.schema';
import { sellerProfileSchema } from '../schemas/seller.schema';
import { changePasswordSchema } from '../schemas/password.schema';
import { withAuthAction, withAuthQuery } from '@/lib/actionMiddleware';

const imageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
});

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

/**
 * Updates profile picture.
 */
export const updateProfilePicture = withAuthAction(
  async ({ session }, data: z.infer<typeof imageSchema>) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: { avatarPublicId: true },
    });

    if (user?.avatarPublicId && user.avatarPublicId !== data.publicId) {
      await deleteImage(user.avatarPublicId);
    }

    await db
      .update(users)
      .set({
        avatarUrl: data.url,
        avatarPublicId: data.publicId,
      })
      .where(eq(users.id, session.userId));

    return { success: true };
  }
);

/**
 * Updates buyer profile.
 */
export const updateBuyerProfile = withAuthAction(
  async ({ session }, data: z.infer<typeof buyerProfileSchema>) => {
    const existing = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: { onboardingData: true },
    });

    const onboardingData = (existing?.onboardingData || {}) as BuyerOnboardingData;

    await db
      .update(users)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
        avatarPublicId: data.avatarPublicId,
        onboardingData: {
          ...onboardingData,
          firstName: data.firstName,
          lastName: data.lastName,
          bio: data.bio,
          country: data.country,
          birthday: data.birthday,
          interests: data.interests,
          avatarUrl: data.avatarUrl,
          avatarPublicId: data.avatarPublicId,
        },
      })
      .where(eq(users.id, session.userId));

    await setSession({
      ...session,
      firstName: data.firstName,
      lastName: data.lastName,
      avatarUrl: data.avatarUrl,
    });

    return { success: true };
  }
);

/**
 * Gets buyer profile.
 */
export const getBuyerProfile = withAuthQuery(
  async ({ session }) => {
    return db.query.users.findFirst({
      where: eq(users.id, session.userId),
    });
  }
);

/**
 * Changes password.
 */
export const changePassword = withAuthAction(
  async ({ session }, data: z.infer<typeof changePasswordSchema>) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: { password: true },
    });

    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(data.currentPassword, user.password);
    if (!isMatch) throw new Error("Incorrect current password");

    const hashedPassword = await bcrypt.hash(data.newPassword, 12);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, session.userId));

    return { success: true };
  }
);

/**
 * Gets seller profile.
 */
export const getSellerProfile = withAuthQuery(
  async ({ session }) => {
    const [user, shop] = await Promise.all([
      db.query.users.findFirst({
        where: eq(users.id, session.userId),
        columns: {
          id: true,
          onboardingData: true,
          firstName: true,
          lastName: true,
          bio: true,
          avatarUrl: true,
          avatarPublicId: true,
          createdAt: true,
        },
      }),
      db.query.shops.findFirst({
        where: eq(shops.userId, session.userId),
      }),
    ]);

    if (!user) return null;

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
  }
);

/**
 * Updates seller profile.
 */
export const updateSellerProfile = withAuthAction(
  async ({ session }, data: z.infer<typeof sellerProfileSchema>) => {
    const existing = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: { onboardingData: true },
    });

    const onboardingData = (existing?.onboardingData || {}) as SellerOnboardingData;

    await Promise.all([
      db.update(users)
        .set({
          firstName: data.firstName,
          lastName: data.lastName,
          bio: data.bio,
          avatarUrl: data.avatarUrl,
          avatarPublicId: data.avatarPublicId,
          onboardingData: {
            ...onboardingData,
            firstName: data.firstName,
            lastName: data.lastName,
            bio: data.bio,
            avatarUrl: data.avatarUrl,
            avatarPublicId: data.avatarPublicId,
            makerQuote: data.makerQuote,
            country: data.country,
            city: data.city,
          },
        })
        .where(eq(users.id, session.userId)),
      db.update(shops)
        .set({
          name: data.shopName,
          logoUrl: data.logoUrl,
          logoPublicId: data.logoPublicId,
        })
        .where(eq(shops.userId, session.userId)),
    ]);

    await setSession({
      ...session,
      firstName: data.firstName,
      lastName: data.lastName,
      avatarUrl: data.avatarUrl,
      shopName: data.shopName,
    });

    return { success: true };
  }
);
