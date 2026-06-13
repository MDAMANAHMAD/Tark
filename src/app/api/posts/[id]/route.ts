import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Post from '@/lib/models/post';
import Category from '@/lib/models/category';
import { slugify } from '@/lib/utils';
import { deleteImage } from '@/lib/cloudinary';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    await dbConnect();
    const post = await Post.findById(id).populate('category', 'name slug');

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const body = await req.json();
    const { 
      title, 
      content, 
      category, 
      tags, 
      image, 
      status, 
      scheduledAt,
      metaTitle,
      metaDescription 
    } = body;

    if (!title || !content || !category || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    // Verify post exists
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Handle slug change if title has changed
    let slug = post.slug;
    if (post.title !== title) {
      let baseSlug = slugify(title);
      slug = baseSlug;
      let counter = 1;
      while (await Post.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Delete old image from Cloudinary if image has changed
    if (post.image !== image && post.image && !post.image.includes('unsplash.com')) {
      await deleteImage(post.image);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        content,
        category,
        tags: tags || [],
        image,
        status,
        scheduledAt: status === 'scheduled' ? new Date(scheduledAt) : undefined,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || '',
      },
      { new: true }
    );

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    await dbConnect();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Delete image from Cloudinary
    if (post.image && !post.image.includes('unsplash.com')) {
      await deleteImage(post.image);
    }

    await Post.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
