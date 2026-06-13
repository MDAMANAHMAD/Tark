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
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse">Loading comments stream...</div>
        ) : filteredComments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800 text-xs font-bold uppercase text-slate-400">
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Comment</th>
                  <th className="px-6 py-4">Post Link</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Posted Date</th>
                  <th className="px-6 py-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
                {filteredComments.map((comment) => (
                  <tr key={comment._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{comment.name}</p>
                      <p className="text-xxs text-slate-400 font-mono mt-0.5">{comment.email}</p>
                    </td>
                    <td className="px-6 py-4 max-w-sm">
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed break-words whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </td>
                    <td className="px-6 py-4 max-w-xxs truncate">
                      <a 
                        href={`/blog/${comment.postId?.slug}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                      >
                        {comment.postId?.title}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xxs font-bold uppercase ${getStatusBadge(comment.status)}`}>
                        {comment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(comment.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      {comment.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(comment._id, 'approved')}
                          className="inline-flex p-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/20 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600"
                          title="Approve Comment"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {comment.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(comment._id, 'rejected')}
                          className="inline-flex p-1.5 rounded-lg border border-amber-100 dark:border-amber-900/20 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-600"
                          title="Reject Comment"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteClick(comment)}
                        className="inline-flex p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-905/20 text-rose-650 hover:text-rose-800"
                        title="Delete Comment"
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
