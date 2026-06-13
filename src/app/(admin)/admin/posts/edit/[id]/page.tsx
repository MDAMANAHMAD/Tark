'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles, Image as ImageIcon, Calendar } from 'lucide-react';
import { slugify } from '@/lib/utils';
import Editor from '@/components/Editor';
import confetti from 'canvas-confetti';

interface Category {
  _id: string;
  name: string;
}

export default function EditPostPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  const router = useRouter();
  
  // Form States
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft');
  const [scheduledAt, setScheduledAt] = useState('');
  
  // SEO States
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch categories & post details
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Categories
        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }

        // Fetch Post Details
        const postRes = await fetch(`/api/posts/${id}`);
        if (postRes.ok) {
          const postData = await postRes.json();
          setTitle(postData.title);
          setSlug(postData.slug);
          setSelectedCategory(postData.category?._id || postData.category);
          setTagsInput(postData.tags?.join(', ') || '');
          setImageUrl(postData.image);
          setContent(postData.content);
          setStatus(postData.status);
          
          if (postData.scheduledAt) {
            // Format ISO date to yyyy-MM-ddThh:mm
            const date = new Date(postData.scheduledAt);
            const formatted = date.toISOString().slice(0, 16);
            setScheduledAt(formatted);
          }
          
          setMetaTitle(postData.metaTitle || '');
          setMetaDescription(postData.metaDescription || '');
        } else {
          setErrorMsg('Post not found.');
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to load post properties.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Auto-slugify title if manual slug mode is disabled
  useEffect(() => {
    if (!isSlugManual && title) {
      setSlug(slugify(title));
    }
  }, [title, isSlugManual]);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setImageUrl(data.url);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !selectedCategory || !imageUrl) {
      setErrorMsg('Please enter all required fields.');
      return;
    }

    if (status === 'scheduled' && !scheduledAt) {
      setErrorMsg('Please specify a publication date for scheduled posts.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    // Process tags
    const tags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          category: selectedCategory,
          tags,
          image: imageUrl,
          status,
          scheduledAt: status === 'scheduled' ? scheduledAt : undefined,
          metaTitle: metaTitle || title,
          metaDescription: metaDescription || '',
        }),
      });

      if (res.ok) {
        // Trigger celebratory confetti if changed to published
        if (status === 'published') {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
        
        setTimeout(() => {
          router.push('/admin/posts');
        }, 1000);
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || 'Failed to save post.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-24 text-slate-400 animate-pulse font-semibold">
        Fetching post attributes...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-855 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Edit Post</h1>
            <p className="text-sm text-slate-500 mt-1">Modify article content, settings, and metadata</p>
          </div>
        </div>

        <button
          onClick={handleSaveSubmit}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 hover:scale-[1.02] disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Updating...' : 'Update Post'}
        </button>
      </header>

      {errorMsg && (
        <div className="p-4 bg-rose-55 border border-rose-200 dark:bg-rose-955/20 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Main Grid Workspace */}
      <form onSubmit={handleSaveSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Editor and Main content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Post Title */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a catchy title..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                <span>URL Slug (SEO Slug) *</span>
                <button
                  type="button"
                  onClick={() => setIsSlugManual(!isSlugManual)}
                  className="text-xxs text-blue-600 dark:text-blue-400 hover:underline lowercase font-semibold"
                >
                  {isSlugManual ? 'Reset Auto-slug' : 'Edit Slug Manually'}
                </button>
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsSlugManual(true);
                }}
                placeholder="my-blog-post-slug"
                className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Tiptap Editor Canvas */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Content Editor *
              </label>
              <span className="text-xxs font-semibold text-indigo-500 dark:text-teal-400">
                Supports Multiple Images & Videos
              </span>
            </div>
            <Editor content={content} onChange={setContent} />
            <p className="text-xxs text-slate-400 dark:text-slate-500 italic">
              💡 Pro-Tip: Place your cursor anywhere in the text flow above and click the toolbar icons (image / video) to insert media at that specific spot.
            </p>
          </div>

          {/* Meta SEO Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-500" />
              SEO Custom Meta tags
            </h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Title that appears in Search Engine results..."
                className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                SEO Meta Description
              </label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Summarize the article in 150-160 characters for search snippets..."
                className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Col: Settings, categories, metadata, publish status */}
        <div className="lg:col-span-4 space-y-6">
          {/* Post settings panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Post Settings</h3>

            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Category *
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. constitutional, law, exams"
                className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Status Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Publishing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Publish (Public Immediately)</option>
                <option value="scheduled">Schedule Publication</option>
              </select>
            </div>

            {/* Scheduled At selector */}
            {status === 'scheduled' && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Scheduled Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            )}
          </div>

          {/* Featured Image Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Featured Image *</h3>
            
            {imageUrl ? (
              <div className="space-y-3 relative group">
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <img
                    src={imageUrl}
                    alt="Featured Image Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="text-xs font-semibold text-rose-500 hover:underline block text-center w-full"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div 
                onClick={() => document.getElementById('featured-image-file')?.click()}
                className="aspect-video w-full rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-950 flex flex-col items-center justify-center cursor-pointer transition-all gap-2"
              >
                {isUploading ? (
                  <div className="text-slate-400 text-xs animate-pulse font-semibold">Uploading featured asset...</div>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Upload featured image</span>
                  </>
                )}
              </div>
            )}

            {/* Hidden Input file */}
            <input
              type="file"
              id="featured-image-file"
              onChange={handleImageFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
