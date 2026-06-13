'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, FolderTree, MessageSquare, Eye, Mail, 
  ArrowRight, Plus, RefreshCw, Clock, MessageSquareCheck 
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Metrics {
  totalPosts: number;
  totalCategories: number;
  totalComments: number;
  totalViews: number;
}

interface RecentPost {
  _id: string;
  title: string;
  slug: string;
  category: { name: string };
  createdAt: string;
}

interface RecentComment {
  _id: string;
  name: string;
  content: string;
  status: string;
  postId: { title: string; slug: string };
  createdAt: string;
}

interface RecentMessage {
  _id: string;
  name: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface ViewOverTime {
  day: string;
  views: number;
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [recentComments, setRecentComments] = useState<RecentComment[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [viewsOverTime, setViewsOverTime] = useState<ViewOverTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/dashboard/stats');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
        setRecentPosts(data.recentPosts);
        setRecentComments(data.recentComments);
        setRecentMessages(data.recentMessages);
        setViewsOverTime(data.viewsOverTime);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  // Calculate SVG line chart coordinates if views exist
  const maxViews = viewsOverTime.length > 0 ? Math.max(...viewsOverTime.map(d => d.views), 10) : 10;
  const chartHeight = 160;
  const chartWidth = 500;
  const points = viewsOverTime.map((d, index) => {
    const x = (index / (viewsOverTime.length - 1)) * chartWidth;
    const y = chartHeight - (d.views / maxViews) * chartHeight + 20; // 20px padding top
    return { x, y };
  });
  const pathData = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Overview Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time metrics, recent activity, and website health indicators</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchStats}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850 transition-all text-slate-500"
            title="Refresh statistics"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-500/10 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Write Blog Post
          </Link>
        </div>
      </header>

      {/* Metrics Grid */}
      {metrics && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Posts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-450 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Articles</p>
              <h3 className="text-2xl font-extrabold mt-1">{metrics.totalPosts}</h3>
            </div>
          </div>

          {/* Card 2: Views */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-450 rounded-xl">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Views</p>
              <h3 className="text-2xl font-extrabold mt-1">{metrics.totalViews.toLocaleString()}</h3>
            </div>
          </div>

          {/* Card 3: Comments */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-455 rounded-xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Comments Log</p>
              <h3 className="text-2xl font-extrabold mt-1">{metrics.totalComments}</h3>
            </div>
          </div>

          {/* Card 4: Categories */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-455 rounded-xl">
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</p>
              <h3 className="text-2xl font-extrabold mt-1">{metrics.totalCategories}</h3>
            </div>
          </div>
        </section>
      )}

      {/* Analytics Chart & Recent Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Views Line Chart */}
        <section className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Views Traffic (Past 7 Days)</h3>
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">Auto-Generated</span>
          </div>

          <div className="w-full aspect-[21/9] min-h-[200px] flex items-center justify-center pt-4">
            {viewsOverTime.length > 0 ? (
              <div className="w-full flex flex-col items-center">
                <svg className="w-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}>
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2={chartWidth} y2="20" stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
                  <line x1="0" y1={chartHeight/2 + 20} x2={chartWidth} y2={chartHeight/2 + 20} stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
                  <line x1="0" y1={chartHeight + 20} x2={chartWidth} y2={chartHeight + 20} stroke="#e2e8f0" className="dark:stroke-slate-800" />

                  {/* Gradient Area below line */}
                  {points.length > 0 && (
                    <path
                      d={`${pathData} L ${points[points.length-1].x} ${chartHeight + 20} L ${points[0].x} ${chartHeight + 20} Z`}
                      fill="url(#gradient-chart)"
                      opacity="0.12"
                    />
                  )}

                  {/* Main Line path */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Dots on nodes */}
                  {points.map((p, idx) => (
                    <circle
                      key={idx}
                      cx={p.x}
                      cy={p.y}
                      r="4.5"
                      fill="#ffffff"
                      stroke="#2563eb"
                      strokeWidth="2.5"
                    />
                  ))}

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="gradient-chart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* X Axis Labels */}
                <div className="w-full flex justify-between px-1.5 mt-3 text-xs font-semibold text-slate-400">
                  {viewsOverTime.map((d, i) => (
                    <span key={i}>{d.day}</span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Not enough data to display chart</p>
            )}
          </div>
        </section>

        {/* Recent Blog Posts Panel */}
        <section className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Recent Publications</h3>
            
            {recentPosts.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-850">
                {recentPosts.map((post) => (
                  <div key={post._id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                    <Link 
                      href={`/blog/${post.slug}`} 
                      className="text-sm font-semibold hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1 block"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center justify-between text-xxs font-medium text-slate-400">
                      <span>{post.category.name}</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 py-4 text-center">No posts created yet.</p>
            )}
          </div>
          
          <div className="pt-4 border-t border-slate-100 dark:border-slate-850 mt-4">
            <Link 
              href="/admin/posts"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Manage Blog Posts
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>

      {/* Messages and Comments moderation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Comments Moderation */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MessageSquareCheck className="w-5 h-5 text-indigo-500" />
              Latest Discussion Comments
            </h3>

            {recentComments.length > 0 ? (
              <div className="space-y-3">
                {recentComments.map((comment) => (
                  <div key={comment._id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1.5 font-bold">
                      <span className="text-slate-700 dark:text-slate-300">{comment.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xxs ${
                        comment.status === 'approved' 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' 
                          : comment.status === 'rejected'
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-955/20 dark:text-rose-400'
                          : 'bg-amber-50 text-amber-600 dark:bg-amber-955/20 dark:text-amber-400'
                      }`}>
                        {comment.status}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed italic">
                      &ldquo;{comment.content}&rdquo;
                    </p>
                    <div className="mt-2 text-xxs font-medium text-slate-400 truncate">
                      On: {comment.postId?.title}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 py-6 text-center">No comments logged yet.</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-850 mt-4">
            <Link 
              href="/admin/comments"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Moderate Comments
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Recent Inquiries */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Mail className="w-5 h-5 text-teal-500" />
              Recent Contact Inquiries
            </h3>

            {recentMessages.length > 0 ? (
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <div key={msg._id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-800 dark:text-slate-200">{msg.name}</span>
                      <span className="text-slate-400 font-medium text-xxs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                    <div className="font-bold text-slate-700 dark:text-slate-300">
                      Sub: {msg.subject}
                    </div>
                    <p className="text-slate-505 dark:text-slate-405 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 py-6 text-center">No contact inquiries received yet.</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-850 mt-4">
            <Link 
              href="/admin/messages"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All Inquiries
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
