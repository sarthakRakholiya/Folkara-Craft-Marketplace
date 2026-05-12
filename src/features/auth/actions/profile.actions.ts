'use server';

import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/session';
import { deleteImage } from '@/lib/cloudinary';
import { z } from 'zod';

const imageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
});

type ActionResult = { success: true } | { error: string };

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
