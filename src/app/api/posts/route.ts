import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Post from '@/lib/models/post';
import Category from '@/lib/models/category';
import User from '@/lib/models/user';
import { slugify } from '@/lib/utils';

// Helper function to auto-publish scheduled posts whose time has passed
async function publishScheduledPosts() {
  try {
    const now = new Date();
    await Post.updateMany(
      { status: 'scheduled', scheduledAt: { $lte: now } },
      { status: 'published' }
    );
  } catch (error) {
    console.error('Error auto-publishing scheduled posts:', error);
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    await publishScheduledPosts();

    const { searchParams } = new URL(req.url);
    
    // Pagination params
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '6', 10);
    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get('search') || '';
    const categorySlug = searchParams.get('category') || '';
    const tag = searchParams.get('tag') || '';
    const adminView = searchParams.get('admin') === 'true';

    const session = await getServerSession(authOptions);
    const isAdmin = session && (session.user as any).role === 'admin';

    // Base query
    const query: any = {};

    // If not admin viewing their panel, show only published posts
    if (!(adminView && isAdmin)) {
      query.status = 'published';
    }

    // Category filter
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        query.category = category._id;
      } else {
        // Return empty results if category slug is invalid
        return NextResponse.json({ posts: [], page, pages: 0, total: 0 });
      }
    }

    // Tag filter
    if (tag) {
      query.tags = tag;
    }

    // Search query
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
      ];
    }

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('category', 'name slug')
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      posts,
      page,
      pages,
      total,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      title, 
      content, 
      category, 
      tags, 
      image, 
      status = 'draft', 
      scheduledAt,
      metaTitle,
      metaDescription 
    } = body;

    if (!title || !content || !category || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    // Auto-generate unique slug
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (await Post.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Ensure category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const post = await Post.create({
      title,
      slug,
      content,
      category,
      tags: tags || [],
      image,
      author: (session.user as any).id,
      status,
      scheduledAt: status === 'scheduled' ? new Date(scheduledAt) : undefined,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || '',
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
