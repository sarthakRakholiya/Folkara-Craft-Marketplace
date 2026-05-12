import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { uploadImage, type UploadFolder } from '@/lib/cloudinary';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const VALID_FOLDERS: UploadFolder[] = ['profiles', 'shops/logos'];



export async function POST(request: NextRequest) {
  // 1. Auth check — only logged-in users can upload
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as UploadFolder | null;
    const deletePublicId = formData.get('deletePublicId') as string | null;
    // Support standalone deletion request (e.g. from sendBeacon or cleanup hooks)
    if (deletePublicId && !file) {
      try {
        const { deleteImage } = await import('@/lib/cloudinary');
        await deleteImage(deletePublicId);
        return NextResponse.json({ success: true });
      } catch (err) {
        console.error('Failed to delete old image:', err);
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
      }
    }

    // 2. Validate file exists
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 3. Validate folder is one of the allowed values
    if (!folder || !VALID_FOLDERS.includes(folder)) {
      return NextResponse.json({ error: 'Invalid upload folder' }, { status: 400 });
    }

    // 4. Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // 5. Validate file size
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5 MB.' },
        { status: 400 }
      );
    }

    // 6. Convert File → base64 data URI (what Cloudinary SDK expects)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    // Delete old image if deletePublicId is provided
    if (deletePublicId) {
      try {
        const { deleteImage } = await import('@/lib/cloudinary');
        await deleteImage(deletePublicId);
      } catch (err) {
        console.error('Failed to delete old image:', err);
      }
    }

    // 7. Use userId as the public_id for profiles — each user has exactly one
    //    image and re-uploading overwrites it automatically (no orphaned files).
    //    For shop logos, let Cloudinary generate a unique ID.
    const publicId = folder === 'profiles' ? session.userId : undefined;

    // 8. Upload to Cloudinary
    const result = await uploadImage(dataUri, folder, publicId);

    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}
