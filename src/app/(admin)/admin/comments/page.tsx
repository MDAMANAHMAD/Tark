'use client';

import React, { useEffect, useState } from 'react';
import { Check, X, Trash2, MessageSquare, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';

interface Comment {
  _id: string;
  postId: { title: string; slug: string };
  name: string;
  email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Delete modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/comments?admin=true');
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchComments(); // Reload comments list
      } else {
        alert('Failed to update comment status.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    }
  };

  const handleDeleteClick = (comment: Comment) => {
    setCommentToDelete(comment);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!commentToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/comments/${commentToDelete._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeleteModalOpen(false);
        setCommentToDelete(null);
        fetchComments();
      } else {
        alert('Failed to delete comment.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredComments = comments.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'rejected':
        return 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400';
      case 'pending':
      default:
        return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Comments Moderation</h1>
          <p className="text-sm text-slate-500 mt-1">Approve, reject, or delete visitor comments</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-1 rounded-xl shadow-inner text-xs font-semibold gap-1">
          {['all', 'pending', 'approved', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                filter === tab 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Grid List */}
      <div className="glass-card border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse">Loading comments stream...</div>
        ) : filteredComments.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredComments.map((comment) => (
              <div 
                key={comment._id} 
                className="p-6 hover:bg-slate-50/40 dark:hover:bg-slate-950/10 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="space-y-3 flex-1 min-w-0">
                  {/* Author Header */}
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                      {comment.name}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] truncate max-w-[180px]" title={comment.email}>
                      ({comment.email})
                    </span>
                    <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                    <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>

                  {/* Comment Body */}
                  <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed break-words whitespace-pre-wrap">
                    {comment.content}
                  </div>

                  {/* Context Link */}
                  {comment.postId && (
                    <div className="text-xs flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                      <span>Article:</span>
                      <a 
                        href={`/blog/${comment.postId.slug}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-semibold truncate max-w-[280px] sm:max-w-md"
                        title={comment.postId.title}
                      >
                        {comment.postId.title}
                      </a>
                    </div>
                  )}
                </div>

                {/* Badging and Actions */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800/60 shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(comment.status)}`}>
                    {comment.status}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {comment.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateStatus(comment._id, 'approved')}
                        className="inline-flex p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                        title="Approve Comment"
                      >
                        <Check className="w-4.5 h-4.5" />
                      </button>
                    )}
                    {comment.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(comment._id, 'rejected')}
                        className="inline-flex p-2 rounded-xl border border-amber-100 dark:border-amber-900/30 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-amber-600 dark:text-amber-400 transition-colors"
                        title="Reject Comment"
                      >
                        <X className="w-4.5 h-4.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClick(comment)}
                      className="inline-flex p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-450 transition-colors"
                      title="Delete Comment"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 dark:text-slate-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-350" />
            <p>No comments found in this folder.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Comment"
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
          Are you sure you want to permanently delete the comment posted by &ldquo;<span className="font-bold">{commentToDelete?.name}</span>&rdquo;?
          Note that deleting a root comment will also cascade-delete any replies to it.
        </p>
      </Modal>
    </div>
  );
}
