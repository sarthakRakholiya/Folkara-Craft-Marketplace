"use server";

import { db } from '@/lib/db';
import { shops } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { deleteImage } from '@/lib/cloudinary';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';
import { setSession } from '@/lib/session';
import { withAuthAction, withAuthQuery } from '@/lib/actionMiddleware';

const imageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
});

// Security helper — ensures the shop belongs to the logged-in user
async function getShopForUser(shopId: string, userId: string) {
  return db.query.shops.findFirst({
    where: and(eq(shops.id, shopId), eq(shops.userId, userId)),
    columns: { id: true, logoPublicId: true },
  });
}

/**
 * Creates or updates a shop.
 */
export const createShop = withAuthAction(
  async ({ session }, name: string) => {
    const existingShop = await db.query.shops.findFirst({
      where: eq(shops.userId, session.userId),
      columns: { id: true },
    });

    if (existingShop) {
      await db
        .update(shops)
        .set({ name, updatedAt: new Date() })
        .where(eq(shops.id, existingShop.id));
      
      await setSession({ ...session, shopName: name });
      return { success: true, data: existingShop.id };
    }

    const id = createId();
    await db
      .insert(shops)
      .values({ id, userId: session.userId, name });

    await setSession({ ...session, shopName: name });
    return { success: true, data: id };
  }
);

/**
 * Updates shop logo.
 */
export const updateShopLogo = withAuthAction(
  async ({ session }, { shopId, data }: { shopId: string; data: z.infer<typeof imageSchema> }) => {
    const shop = await getShopForUser(shopId, session.userId);
    if (!shop) throw new Error("Shop not found");

    if (shop.logoPublicId && shop.logoPublicId !== data.publicId) {
      await deleteImage(shop.logoPublicId);
    }

    await db
      .update(shops)
      .set({
        logoUrl: data.url,
        logoPublicId: data.publicId,
      })
      .where(eq(shops.id, shopId));

    return { success: true };
  }
);
