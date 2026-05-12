'use server';

import { db } from '@/lib/db';
import { shops } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/session';
import { deleteImage } from '@/lib/cloudinary';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

const imageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
});

type ActionResult = { success: true } | { error: string };

// Security helper — ensures the shop belongs to the logged-in user
async function getShopForUser(shopId: string, userId: string) {
  return db.query.shops.findFirst({
    where: and(eq(shops.id, shopId), eq(shops.userId, userId)),
  });
}

export async function createShop(
  name: string
): Promise<{ shopId: string } | { error: string }> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    const [shop] = await db
      .insert(shops)
      .values({ id: createId(), userId: session.userId, name })
      .returning({ id: shops.id });

    return { shopId: shop.id };
  } catch {
    return { error: 'Failed to create shop. Please try again.' };
  }
}

export async function updateShopLogo(
  shopId: string,
  data: z.infer<typeof imageSchema>
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const parsed = imageSchema.safeParse(data);
  if (!parsed.success) return { error: 'Invalid image data' };

  try {
    // Verify the shop belongs to the logged-in user before updating
    const shop = await getShopForUser(shopId, session.userId);
    if (!shop) return { error: 'Shop not found' };

    // Delete old logo from Cloudinary to avoid orphaned files
    if (shop.logoPublicId && shop.logoPublicId !== parsed.data.publicId) {
      await deleteImage(shop.logoPublicId);
    }

    await db
      .update(shops)
      .set({
        logoUrl: parsed.data.url,
        logoPublicId: parsed.data.publicId,
      })
      .where(eq(shops.id, shopId));

    return { success: true };
  } catch {
    return { error: 'Failed to update shop logo. Please try again.' };
  }
}
