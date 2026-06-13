import dbConnect from '@/lib/db';
import Post from '@/lib/models/post';
import CommentSection from '@/components/CommentSection';
import ShareButtons from '@/components/ShareButtons';
import BlogCard from '@/components/BlogCard';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, Eye, ChevronLeft, Folder, Tag } from 'lucide-react';
import { formatDate, getReadingTime } from '@/lib/utils';
import type { Metadata } from 'next';

interface Params {
  slug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  await dbConnect();
  const post = await Post.findOne({ slug, status: 'published' });

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.title,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.title,
      images: [{ url: post.image }],
    },
  };
}

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  await dbConnect();

  const session = await getServerSession(authOptions);
  const isAdmin = session && (session.user as any).role === 'admin';

  let post;
  
  if (isAdmin) {
    // Admin can view drafts/scheduled items
    post = await Post.findOne({ slug })
      .populate('category', 'name slug')
      .populate('author', 'name email');
  } else {
    // Public view increments views and only shows published
    post = await Post.findOneAndUpdate(
      { slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('category', 'name slug')
      .populate('author', 'name email');
  }

  if (!post) {
    notFound();
  }

  const readTime = getReadingTime(post.content);

  // Fetch related posts (same category, excluding this one)
  const relatedPosts = await Post.find({
    category: post.category._id,
    _id: { $ne: post._id },
    status: 'published',
  })
    .populate('category', 'name slug')
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
    .limit(3);

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      {/* Decorative neon background spot */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-tr from-indigo-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back button */}
      <div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-teal-400 glass-card px-4.5 py-2.5 rounded-xl transition-all hover:scale-[1.02] duration-200 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Articles
        </Link>
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-12 shadow-xl space-y-10">
        {/* Article Header */}
        <header className="space-y-4">
          {/* Category Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-teal-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <Folder className="w-3.5 h-3.5" />
            <Link 
              href={`/?category=${post.category.slug}`}
              className="hover:underline tracking-wider uppercase"
            >
              {post.category.name}
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent leading-tight">
            {post.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-y-2.5 gap-x-6 text-xs text-slate-500 dark:text-slate-400 pt-3 border-b border-slate-200/50 dark:border-slate-800/80 pb-6 font-semibold">
            <span>
              By <span className="text-slate-800 dark:text-slate-200 font-bold">{post.author.name}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              {readTime}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-400" />
              {post.views} views
            </span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-indigo-500/5 group">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-101"
          />
        </div>

        {/* Article Content */}
        <article className="prose prose-slate dark:prose-invert max-w-none md:text-lg leading-relaxed text-slate-800 dark:text-slate-200 blog-content">
          <div 
            dangerouslySetInnerHTML={{ __html: post.content }} 
            className="space-y-4 font-sans"
          />
        </article>
      </div>

      {/* Tags Section */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <Tag className="w-4 h-4 text-slate-400" />
          {post.tags.map((tag: string) => (
            <Link
              key={tag}
              href={`/?tag=${tag}`}
              className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 dark:hover:text-blue-400 rounded-full transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Sharing buttons */}
      <ShareButtons title={post.title} slug={post.slug} />

      {/* Comment Section (Client Component) */}
      <CommentSection postId={post._id.toString()} />

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="space-y-6 pt-12 mt-12 border-t border-slate-200/60 dark:border-slate-800/60">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rPost) => (
              <BlogCard key={rPost._id.toString()} post={JSON.parse(JSON.stringify(rPost))} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
