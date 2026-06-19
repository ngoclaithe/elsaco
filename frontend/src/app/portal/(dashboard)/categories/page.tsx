'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import type { Category } from '@/lib/types';

export default function PortalCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setCategories(await adminApi.getCategories());
    } catch {
      setCategories([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await adminApi.updateCategory(editingId, form);
    } else {
      await adminApi.createCategory(form);
    }
    setForm({ name: '', slug: '' });
    setEditingId(null);
    load();
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await adminApi.deleteCategory(id);
      load();
    } catch {
      alert('Cannot delete category with products');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-medium mb-8">Categories</h1>

      <form onSubmit={handleSubmit} className="bg-white border p-6 mb-8 grid sm:grid-cols-3 gap-4">
        <input
          placeholder="Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input-field"
        />
        <input
          placeholder="Slug"
          required
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="input-field"
        />
        <button type="submit" className="btn-primary !py-2">
          {editingId ? 'Update' : 'Add category'}
        </button>
      </form>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <div className="bg-white border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Products</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="p-4 font-medium">{cat.name}</td>
                  <td className="p-4 text-muted">{cat.slug}</td>
                  <td className="p-4">{cat._count?.products ?? 0}</td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <button onClick={() => startEdit(cat)} className="underline text-sm">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="underline text-sm text-sale">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
