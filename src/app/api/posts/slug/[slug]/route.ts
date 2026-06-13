import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Post from '@/lib/models/post';
import Category from '@/lib/models/category';
import User from '@/lib/models/user';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    await dbConnect();

    // Find post by slug
    const post = await Post.findOne({ slug })
      .populate('category', 'name slug')
      .populate('author', 'name email');

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const session = await getServerSession(authOptions);
    const isAdmin = session && (session.user as any).role === 'admin';

    // Allow viewing drafts if they are logged-in admin, otherwise restrict
    if (post.status !== 'published' && !isAdmin) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Increment views only for public visits
    if (post.status === 'published' && !isAdmin) {
      post.views = (post.views || 0) + 1;
      await post.save();
    }

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
