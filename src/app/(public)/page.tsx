import dbConnect from '@/lib/db';
import Post from '@/lib/models/post';
import Category from '@/lib/models/category';
import BlogCard from '@/components/BlogCard';
import Link from 'next/link';
import { Terminal, Send, ArrowRight, BookOpen, Star } from 'lucide-react';

interface SearchParams {
  search?: string;
  category?: string;
  page?: string;
}

// Simple server action / submit simulation inside form
async function handleSubscribe(formData: FormData) {
  'use server';
  const email = formData.get('email');
  console.log(`Subscribed: ${email}`);
  // In real app, write to subscriber DB or list
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await dbConnect();
  
  // Resolve Next.js 15 searchParams Promise
  const params = await searchParams;
  const search = params.search || '';
  const categorySlug = params.category || '';
  const page = parseInt(params.page || '1', 10);
  const limit = 6;
  const skip = (page - 1) * limit;

  // 1. Fetch categories
  const categories = await Category.find({}).sort({ name: 1 });

  // 2. Build Post query
  const query: any = { status: 'published' };

  if (categorySlug) {
    const selectedCategory = await Category.findOne({ slug: categorySlug });
    if (selectedCategory) {
      query.category = selectedCategory._id;
    }
  }

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { title: searchRegex },
      { content: searchRegex },
      { tags: searchRegex },
    ];
  }

  // 3. Fetch posts count and posts
  const total = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .populate('category', 'name slug')
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const pages = Math.ceil(total / limit);

  // 4. Determine featured post (latest post overall, only on page 1 and when not filtering)
  const showHeroPost = page === 1 && !categorySlug && !search && posts.length > 0;
  const heroPost = showHeroPost ? posts[0] : null;
  const gridPosts = showHeroPost ? posts.slice(1) : posts;

  return (
    <div className="space-y-16">
      {/* Hero Landing Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-950 to-fuchsia-950 text-white py-16 px-8 md:px-16 shadow-2xl border border-indigo-500/25 dark:border-indigo-400/20 shadow-[0_20px_50px_rgba(99,102,241,0.15)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(99,102,241,0.2),transparent)] pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
        <div className="absolute top-1/2 left-2/3 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: '-4s' }} />
        
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/60 text-xs font-bold text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
              <Star className="w-3.5 h-3.5 fill-teal-300 text-teal-300 animate-spin" style={{ animationDuration: '6s' }} />
              Welcome to Tark Law Chronicles
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Insights, Case Briefs, and Notes for <span className="bg-gradient-to-r from-teal-300 via-pink-400 to-indigo-300 bg-clip-text text-transparent">Future Jurists</span>
            </h1>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
              Explore detailed law school survival guides, analytical breakdowns of landmark judicial decisions, study aids, and legal research methodologies.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#articles" 
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-700 hover:via-indigo-700 hover:to-teal-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Reading
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/15 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Get in Touch
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:flex lg:col-span-4 justify-center items-center relative h-64 w-full">
            {/* Pulsing ring aura */}
            <div className="absolute w-48 h-48 rounded-full border border-indigo-500/20 animate-ping opacity-75" style={{ animationDuration: '3s' }} />
            <div className="absolute w-40 h-40 rounded-full border border-teal-500/20 animate-ping opacity-50" style={{ animationDuration: '4s' }} />
            
            <div className="relative w-44 h-44 p-4 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-indigo-500/10 hover:rotate-2 transition-transform duration-500">
              <svg className="w-full h-full text-indigo-300 drop-shadow-[0_0_20px_rgba(99,102,241,0.4)] animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ animationDuration: '4s' }}>
                <line x1="12" y1="2" x2="12" y2="22" strokeWidth="1.8" stroke="url(#scale-grad)" />
                <line x1="5" y1="22" x2="19" y2="22" strokeWidth="1.8" stroke="url(#scale-grad)" />
                <line x1="4" y1="7" x2="20" y2="7" strokeWidth="1.8" stroke="url(#scale-grad)" />
                <line x1="4" y1="7" x2="1.5" y2="15" />
                <line x1="4" y1="7" x2="6.5" y2="15" />
                <path d="M1.5 15h5c0 1.38-1.12 2.5-2.5 2.5s-2.5-1.12-2.5-2.5z" fill="url(#plate-grad)" />
                <line x1="20" y1="7" x2="17.5" y2="15" />
                <line x1="20" y1="7" x2="22.5" y2="15" />
                <path d="M17.5 15h5c0 1.38-1.12 2.5-2.5 2.5s-2.5-1.12-2.5-2.5z" fill="url(#plate-grad)" />
                <defs>
                  <linearGradient id="scale-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                  <linearGradient id="plate-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      {heroPost && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Featured Article</h2>
          </div>
          
          <div className="group grid grid-cols-1 lg:grid-cols-2 glass-card card-hover-neon-purple rounded-3xl overflow-hidden shadow-xl lg:h-[380px]">
            {/* Left Column: Constrained Featured Image */}
            <Link 
              href={`/blog/${heroPost.slug}`} 
              className="relative w-full h-64 lg:h-full overflow-hidden block"
            >
              <img
                src={heroPost.image}
                alt={heroPost.title}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            {/* Right Column: Content Details */}
            <div className="p-8 md:p-10 flex flex-col justify-between bg-white/10 dark:bg-slate-900/10 h-full">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold px-3 py-1 bg-gradient-to-r from-blue-500/10 to-teal-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-md">
                    {heroPost.category.name}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold leading-tight text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-teal-400 transition-colors">
                  <Link href={`/blog/${heroPost.slug}`}>
                    {heroPost.title}
                  </Link>
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed line-clamp-3">
                  {heroPost.content ? heroPost.content.replace(/<[^>]*>/g, '').slice(0, 180) + '...' : ''}
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-200/50 dark:border-slate-800/60 mt-4">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  By <span className="font-bold text-slate-700 dark:text-slate-300">{heroPost.author.name}</span>
                </div>
                <Link 
                  href={`/blog/${heroPost.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 group/link"
                >
                  Read Article
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Feed Container */}
      <section id="articles" className="scroll-mt-20 space-y-8">
        {/* Categories Bar & Active Filters header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
          <div className="flex flex-wrap gap-2.5">
            <Link 
              href="/"
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                !categorySlug 
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 text-white shadow-md shadow-indigo-500/25'
                  : 'glass-card border border-slate-200/50 dark:border-slate-800/80 text-slate-600 dark:text-slate-300 hover:border-blue-500/25 hover:text-blue-600 dark:hover:text-teal-400 hover:bg-slate-100/30'
              }`}
            >
              All Topics
            </Link>
            {categories.map((cat) => (
              <Link 
                key={cat._id.toString()}
                href={`/?category=${cat.slug}${search ? `&search=${search}` : ''}`}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  categorySlug === cat.slug
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 text-white shadow-md shadow-indigo-500/25'
                    : 'glass-card border border-slate-200/50 dark:border-slate-800/80 text-slate-600 dark:text-slate-300 hover:border-blue-500/25 hover:text-blue-600 dark:hover:text-teal-400 hover:bg-slate-100/30'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
          
          {search && (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Showing results for &ldquo;<span className="font-semibold text-slate-900 dark:text-slate-100">{search}</span>&rdquo;
              <Link href="/" className="ml-2 text-blue-600 dark:text-blue-400 hover:underline">Clear</Link>
            </div>
          )}
        </div>

        {/* Editorial Stream List Feed */}
        {gridPosts.length > 0 ? (
          <div className="space-y-12 max-w-5xl mx-auto py-4">
            {gridPosts.map((post, idx) => (
              <BlogCard 
                key={post._id.toString()} 
                post={JSON.parse(JSON.stringify(post))} 
                index={idx}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
            <BookOpen className="w-10 h-10 mx-auto text-slate-400" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No articles found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
              We couldn&apos;t find any published articles matching your criteria. Try adjusting your filter or search keywords.
            </p>
            <Link 
              href="/"
              className="inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-sm font-semibold"
            >
              Reset Filters
            </Link>
          </div>
        )}

        {/* Pagination Section */}
        {pages > 1 && (
          <div className="flex items-center justify-between pt-8 border-t border-slate-200/60 dark:border-slate-800/60">
            <Link
              href={page > 1 ? `/?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ''}${search ? `&search=${search}` : ''}` : '#'}
              className={`px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-850 text-sm font-semibold ${
                page > 1 
                  ? 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                  : 'opacity-50 pointer-events-none text-slate-400'
              }`}
            >
              Previous
            </Link>
            
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Page {page} of {pages}
            </span>
            
            <Link
              href={page < pages ? `/?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ''}${search ? `&search=${search}` : ''}` : '#'}
              className={`px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-850 text-sm font-semibold ${
                page < pages 
                  ? 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                  : 'opacity-50 pointer-events-none text-slate-400'
              }`}
            >
              Next
            </Link>
          </div>
        )}
      </section>

      {/* Newsletter Subscription Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 p-8 md:p-12 text-white border border-indigo-500/20 shadow-2xl shadow-indigo-550/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute top-[-30%] right-[-10%] w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-[-30%] left-[-10%] w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: '-6s' }} />

        <div className="relative max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-teal-200 via-pink-300 to-indigo-200 bg-clip-text text-transparent">
            Stay Updated with Our Newsletter
          </h2>
          <p className="text-slate-300 leading-relaxed text-sm md:text-base font-medium">
            Get legal briefings, landmark case studies, law school notes, and academic summaries sent directly to your inbox. No spam, unsubscribe anytime.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3 pt-2">
            <input
              type="email"
              name="email"
              placeholder="Enter your email address..."
              required
              className="flex-grow px-5 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm backdrop-blur-md transition-all shadow-inner"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-500/15 flex items-center justify-center gap-2 text-sm hover:scale-[1.02]"
            >
              Subscribe
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
