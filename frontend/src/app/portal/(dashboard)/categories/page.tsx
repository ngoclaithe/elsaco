'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { CategoryFormModal } from '@/components/admin/CategoryFormModal';
import { PortalPageHeader, PortalPanel } from '@/components/admin/PortalUI';
import type { Category } from '@/lib/types';

export default function PortalCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

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

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleSave = async (data: { name: string; slug: string }) => {
    if (editing) {
      await adminApi.updateCategory(editing.id, data);
    } else {
      await adminApi.createCategory(data);
    }
    closeForm();
    load();
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
      <PortalPageHeader
        title="Categories"
        description={`${categories.length} collections`}
        action={
          <button onClick={openCreate} className="btn-primary !py-2.5 !px-6">
            Add category
          </button>
        }
      />

      {loading ? (
        <p className="text-muted">Loading categories...</p>
      ) : (
        <PortalPanel className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr className="text-left text-xs uppercase tracking-wider text-muted">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Slug</th>
                  <th className="p-4 font-medium">Products</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-neutral-50/80">
                    <td className="p-4 font-medium">{cat.name}</td>
                    <td className="p-4 text-muted font-mono text-xs">{cat.slug}</td>
                    <td className="p-4">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs bg-neutral-100 text-neutral-700">
                        {cat._count?.products ?? 0}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(cat)}
                          className="text-sm px-3 py-1.5 border border-neutral-300 rounded hover:border-black"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="text-sm px-3 py-1.5 border border-red-200 text-red-600 rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PortalPanel>
      )}

      {showForm && (
        <CategoryFormModal category={editing} onClose={closeForm} onSave={handleSave} />
      )}
    </div>
  );
}
