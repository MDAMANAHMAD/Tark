'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, FolderTree, AlertCircle, Save, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Delete modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsSaving(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName.trim() }),
      });

      if (res.ok) {
        setNewCatName('');
        fetchCategories();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to create category.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (cat: Category) => {
    setEditingCatId(cat._id);
    setEditingCatName(cat.name);
  };

  const handleEditSave = async (id: string) => {
    if (!editingCatName.trim()) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingCatName.trim() }),
      });

      if (res.ok) {
        setEditingCatId(null);
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update category.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    }
  };

  const handleDeleteClick = (cat: Category) => {
    setCatToDelete(cat);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!catToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/categories/${catToDelete._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeleteModalOpen(false);
        setCatToDelete(null);
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete category.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Categories</h1>
        <p className="text-sm text-slate-500 mt-1">Organize articles and taxonomic tags</p>
      </header>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-semibold">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Add category panel */}
        <section className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-blue-500" />
            Add New Category
          </h3>
          
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Category Name
              </label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Constitutional Law"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50"
            >
              Add Category
            </button>
          </form>
        </section>

        {/* Categories List */}
        <section className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="text-center py-16 text-slate-400 animate-pulse">Loading categories index...</div>
          ) : categories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase text-slate-400">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">URL Slug</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                        {editingCatId === cat._id ? (
                          <input
                            type="text"
                            value={editingCatName}
                            onChange={(e) => setEditingCatName(e.target.value)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          cat.name
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-400 dark:text-slate-500 font-mono text-xs">
                        {cat.slug}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {editingCatId === cat._id ? (
                          <>
                            <button
                              onClick={() => handleEditSave(cat._id)}
                              className="inline-flex p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-600"
                              title="Save Changes"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingCatId(null)}
                              className="inline-flex p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-450"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(cat)}
                              className="inline-flex p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-blue-600 hover:text-blue-800"
                              title="Edit Category"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(cat)}
                              className="inline-flex p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 hover:text-rose-800"
                              title="Delete Category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500">
              <FolderTree className="w-8 h-8 mx-auto mb-2 text-slate-350" />
              <p>No categories created yet.</p>
            </div>
          )}
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Category"
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
          Are you sure you want to permanently delete the category &ldquo;<span className="font-bold">{catToDelete?.name}</span>&rdquo;?
          Note that a category cannot be deleted if there are any posts associated with it.
        </p>
      </Modal>
    </div>
  );
}
