import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type UploadFolder = 'profiles' | 'shops/logos';

export interface UploadResult {
  url: string;        // secure HTTPS URL to display the image
  publicId: string;   // Cloudinary ID needed for deletion
  width: number;
  height: number;
}

export async function uploadImage(
  file: string,           // base64 data URI: "data:image/png;base64,..."
  folder: UploadFolder,
  publicId?: string,      // pass userId for profiles — ensures one file per user
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(file, {
    folder: `folkara/${folder}`,
    public_id: publicId,
    overwrite: true,
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { quality: 'auto' },        // Cloudinary picks best quality/size ratio
      { fetch_format: 'auto' },   // serves WebP to browsers that support it
    ],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
