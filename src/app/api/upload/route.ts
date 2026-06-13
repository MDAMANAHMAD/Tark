import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert the File to a Node.js Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const isCloudinaryConfigured = 
      !!process.env.CLOUDINARY_CLOUD_NAME && 
      !!process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_CLOUD_NAME !== 'dummy_cloud_name';

    let imageUrl = '';
    if (isCloudinaryConfigured) {
      imageUrl = await uploadImage(buffer);
    } else {
      // Local file system upload when Cloudinary is not configured
      const uploadDir = path.join(process.cwd(), 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = path.join(uploadDir, fileName);
      
      await fs.writeFile(filePath, buffer);
      imageUrl = `/api/uploads/${fileName}`;
    }

    return NextResponse.json({ url: imageUrl });
  } catch (error: any) {
    console.error('API Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
