'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, Edit, Trash2, Search, ExternalLink, 
  Calendar, Eye, ChevronLeft, ChevronRight, AlertCircle 
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';

interface Post {
  _id: string;
  title: string;
  slug: string;
  category: { name: string };
  views: number;
  status: 'draft' | 'published' | 'scheduled';
  scheduledAt?: string;
  createdAt: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/posts?admin=true&page=${page}&limit=8&search=${encodeURIComponent(search)}`
      );
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setPages(data.pages);
        setTotal(data.total);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, search]);

  const handleDeleteClick = (post: Post) => {
    setPostToDelete(post);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/posts/${postToDelete._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeleteModalOpen(false);
        setPostToDelete(null);
        fetchPosts(); // Reload post list
      } else {
        alert('Failed to delete post.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'scheduled':
        return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'draft':
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Blog Posts</h1>
          <p className="text-sm text-slate-500 mt-1">Create, edit, view, and delete articles ({total} total)</p>
        </div>
        <div>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-500/10 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Write Blog Post
          </Link>
        </div>
      </header>

      {/* Filter and Search actions */}
      <div className="flex bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search posts by title, tag, or content..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse">Loading posts catalog...</div>
        ) : posts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850 text-xs font-bold uppercase text-slate-400">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Views</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="px-6 py-4 max-w-xs font-semibold text-slate-800 dark:text-slate-200 truncate" title={post.title}>
                      {post.title}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {post.category.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {post.views}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded text-xxs font-semibold uppercase ${getStatusBadge(post.status)}`}>
                        {post.status}
                      </span>
                      {post.status === 'scheduled' && post.scheduledAt && (
                        <p className="text-xxs text-blue-500 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.scheduledAt).toLocaleDateString()}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="inline-flex p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-450 hover:text-slate-700 dark:hover:text-slate-200"
                        title="Preview Article"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/posts/edit/${post._id}`}
                        className="inline-flex p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-55 dark:hover:bg-slate-850 text-blue-600 hover:text-blue-800"
                        title="Edit Article"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(post)}
                        className="inline-flex p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 hover:text-rose-800"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 dark:text-slate-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-350" />
            <p>No blog posts found matching current filters.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 inline-block -mt-0.5" /> Previous
            </button>
            <span className="text-xs text-slate-400">
              Page {page} of {pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, pages))}
              disabled={page === pages}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              Next <ChevronRight className="w-4 h-4 inline-block -mt-0.5" />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Article"
        footer={
          <>
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg"
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to permanently delete the article &ldquo;<span className="font-bold">{postToDelete?.title}</span>&rdquo;?
          This action is destructive and cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
