import { v2 as cloudinary } from 'cloudinary';

// Only configure Cloudinary if the keys are defined
const isConfigured = 
  !!process.env.CLOUDINARY_CLOUD_NAME && 
  !!process.env.CLOUDINARY_API_KEY && 
  !!process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'dummy_cloud_name';

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn(
    'Cloudinary credentials are not configured. Uploads will fall back to using default placeholder images.'
  );
}

export async function uploadImage(fileBuffer: Buffer, folder: string = 'tark_blogs'): Promise<string> {
  if (!isConfigured) {
    // If Cloudinary is not configured, simulate upload delay and return a beautiful placeholder image
    await new Promise((resolve) => setTimeout(resolve, 500));
    const placeholders = [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f', // law gavel & book
      'https://images.unsplash.com/photo-1505664194779-8bebcb95c557', // legal books
      'https://images.unsplash.com/photo-1447069387593-a5de0862481e', // scale of justice, retro documents
      'https://images.unsplash.com/photo-1521791136368-1a9b82753036', // legal signing / consultation
    ];
    const randomIndex = Math.floor(Math.random() * placeholders.length);
    return `${placeholders[randomIndex]}?auto=format&fit=crop&w=800&q=80`;
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(new Error('Image upload failed: ' + error.message));
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Image upload failed: unknown error'));
        }
      }
    ).end(fileBuffer);
  });
}

export async function deleteImage(imageUrl: string): Promise<boolean> {
  if (!isConfigured) {
    return true; // Mock success
  }

  try {
    // Extract publicId from Cloudinary secure URL
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567/tark_blogs/filename.jpg
    const parts = imageUrl.split('/');
    const folderAndFile = parts.slice(parts.indexOf('upload') + 2).join('/'); // tark_blogs/filename.jpg
    const publicId = folderAndFile.substring(0, folderAndFile.lastIndexOf('.')) || folderAndFile; // remove extension

    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}
