'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, CornerDownRight, Calendar, User, Send, CheckCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Comment {
  _id: string;
  name: string;
  content: string;
  parentId: string | null;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyName, setReplyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          name,
          email,
          content,
          parentId: replyToId,
        }),
      });

      if (res.ok) {
        setContent('');
        setReplyToId(null);
        setSubmitSuccess(true);
        // Clear success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to submit comment');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplyClick = (commentId: string, commenterName: string) => {
    setReplyToId(commentId);
    setReplyName(commenterName);
    // Scroll to form
    const formElement = document.getElementById('comment-form');
    formElement?.scrollIntoView({ behavior: 'smooth' });
  };

  // Group comments into root comments and replies
  const rootComments = comments.filter((c) => !c.parentId);
  const getReplies = (parentId: string) => comments.filter((c) => c.parentId === parentId);

  return (
    <div className="space-y-8 mt-12 pt-12 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-500" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Discussion ({comments.length})
        </h3>
      </div>

      {/* Success Alert */}
      {submitSuccess && (
        <div className="flex items-start gap-3 p-4 bg-emerald-55 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 rounded-xl">
          <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">Comment Submitted!</p>
            <p className="text-xs opacity-90 mt-0.5">
              Thank you! Your comment has been sent for moderation and will appear publicly once approved by the administrator.
            </p>
          </div>
        </div>
      )}

      {/* Comment Form */}
      <form id="comment-form" onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-sm space-y-4">
        {replyToId && (
          <div className="flex items-center justify-between px-3 py-2 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs">
            <span className="flex items-center gap-1">
              <CornerDownRight className="w-3.5 h-3.5" />
              Replying to <span className="font-bold">{replyName}</span>
            </span>
            <button 
              type="button" 
              onClick={() => setReplyToId(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-250 font-bold"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase mb-1.5">
            Your Comment
          </label>
          <textarea
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts on this article..."
            className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm flex items-center gap-2 shadow-md shadow-blue-500/10 transition-all disabled:opacity-50 hover:scale-[1.02]"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Comment Feed Tree */}
      {isLoading ? (
        <div className="text-center py-6 text-slate-400 animate-pulse">Loading comments...</div>
      ) : rootComments.length > 0 ? (
        <div className="space-y-6">
          {rootComments.map((comment) => (
            <div key={comment._id} className="space-y-4">
              {/* Root Comment Box */}
              <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-850">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <div className="p-1 rounded-full bg-slate-200 dark:bg-slate-800">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <span className="font-bold">{comment.name}</span>
                  </div>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-slate-605 dark:text-slate-355 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleReplyClick(comment._id, comment.name)}
                    className="text-xs font-semibold text-blue-650 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Reply
                  </button>
                </div>
              </div>

              {/* Nested Replies */}
              {getReplies(comment._id).map((reply) => (
                <div key={reply._id} className="flex gap-3 pl-6 md:pl-10">
                  <div className="flex-shrink-0 text-slate-300 dark:text-slate-700 pt-1">
                    <CornerDownRight className="w-5 h-5" />
                  </div>
                  <div className="flex-grow bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100/60 dark:border-slate-850">
                    <div className="flex items-center justify-between mb-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <div className="p-1 rounded-full bg-slate-200 dark:bg-slate-800">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                        <span className="font-bold">{reply.name}</span>
                      </div>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(reply.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-605 dark:text-slate-355 leading-relaxed whitespace-pre-wrap">
                      {reply.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
          No comments yet. Be the first to start the discussion!
        </div>
      )}
    </div>
  );
}
