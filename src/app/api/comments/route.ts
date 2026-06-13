import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Comment from '@/lib/models/comment';
import Post from '@/lib/models/post';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');
    const adminView = searchParams.get('admin') === 'true';

    await dbConnect();

    // Admin comment list
    if (adminView) {
      const session = await getServerSession(authOptions);
      if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Fetch all comments and populate post titles
      const comments = await Comment.find({})
        .populate('postId', 'title slug')
        .sort({ createdAt: -1 });
      
      return NextResponse.json(comments);
    }

    // Public comments for a specific post
    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    }

    // Public gets ONLY approved comments for the specific post
    const comments = await Comment.find({ postId, status: 'approved' })
      .sort({ createdAt: 1 });

    return NextResponse.json(comments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, name, email, content, parentId = null } = body;

    if (!postId || !name || !email || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    // Ensure the post exists
    const postExists = await Post.findById(postId);
    if (!postExists) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Create the comment - default status is 'pending'
    const newComment = await Comment.create({
      postId,
      name,
      email,
      content,
      parentId,
      status: 'pending', // Requires admin moderation
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
