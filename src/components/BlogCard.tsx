import Link from 'next/link';
import { Calendar, Clock, Eye, ChevronRight } from 'lucide-react';
import { formatDate, getReadingTime, truncateText } from '@/lib/utils';

interface BlogCardProps {
  post: {
    _id: string;
    title: string;
    slug: string;
    content: string;
    category: {
      name: string;
      slug: string;
    };
    tags: string[];
    image: string;
    author: {
      name: string;
    };
    views: number;
    createdAt: string;
  };
  index?: number;
}

export default function BlogCard({ post, index = 0 }: BlogCardProps) {
  const readTime = getReadingTime(post.content);
  const snippet = truncateText(post.content, 160); // slightly longer snippet for row layout

  // Dynamic colors for category tags to make it look premium
  const getCategoryColor = (catName: string) => {
    const name = catName.toLowerCase();
    if (name.includes('constitutional')) return 'bg-blue-50 text-blue-600 dark:bg-blue-900/25 dark:text-blue-400';
    if (name.includes('criminal')) return 'bg-pink-50 text-pink-600 dark:bg-pink-900/25 dark:text-pink-400';
    if (name.includes('corporate')) return 'bg-amber-50 text-amber-700 dark:bg-amber-900/25 dark:text-amber-400';
    if (name.includes('human') || name.includes('rights')) return 'bg-teal-50 text-teal-600 dark:bg-teal-900/25 dark:text-teal-400';
    if (name.includes('tech') || name.includes('digital')) return 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/25 dark:text-cyan-400';
    if (name.includes('school') || name.includes('tips') || name.includes('student')) return 'bg-purple-50 text-purple-600 dark:bg-purple-900/25 dark:text-purple-400';
    return 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-350';
  };

  const getCategoryNeonClass = (catName: string) => {
    const name = catName.toLowerCase();
    if (name.includes('constitutional')) return 'card-hover-neon-blue';
    if (name.includes('criminal')) return 'card-hover-neon-pink';
    if (name.includes('corporate')) return 'card-hover-neon-amber';
    if (name.includes('human') || name.includes('rights')) return 'card-hover-neon-teal';
    if (name.includes('tech') || name.includes('digital')) return 'card-hover-neon-teal';
    if (name.includes('school') || name.includes('tips') || name.includes('student')) return 'card-hover-neon-purple';
    return 'card-hover-neon-pink';
  };

  return (
    <article className={`group flex flex-col lg:flex-row ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''} gap-8 items-center py-10 border-b border-slate-200/50 dark:border-slate-800/40 last:border-b-0 w-full transition-all duration-300`}>
      {/* Featured Image Frame */}
      <Link 
        href={`/blog/${post.slug}`} 
        className={`relative w-full lg:w-[380px] shrink-0 aspect-[16/10] rounded-3xl overflow-hidden border border-slate-200/40 dark:border-slate-800/60 transition-all duration-400 ${getCategoryNeonClass(post.category.name)} block shadow-md`}
      >
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 z-10">
          <span className={`text-xs font-bold px-3 py-1 rounded-lg shadow-md backdrop-blur-md ${getCategoryColor(post.category.name)}`}>
            {post.category.name}
          </span>
        </div>
      </Link>

      {/* Content Details */}
      <div className="flex-grow space-y-3.5 py-1 w-full flex flex-col justify-between min-h-[180px]">
        <div className="space-y-3">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-400 dark:text-slate-500 font-bold">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {readTime}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              {post.views} views
            </span>
          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-extrabold leading-tight text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-teal-400 transition-colors">
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          {/* Description Excerpt */}
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-2">
            {snippet}
          </p>
        </div>

        {/* Footer & Read More Link */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/40">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            By <span className="text-slate-700 dark:text-slate-350 font-bold">{post.author.name}</span>
          </span>
          <Link 
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 group/read"
          >
            Read Brief
            <ChevronRight className="w-4 h-4 group-hover/read:translate-x-1.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </article>
  );
}
