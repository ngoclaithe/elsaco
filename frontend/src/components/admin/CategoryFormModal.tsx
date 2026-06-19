'use client';

import { useEffect, useState } from 'react';
import type { Category } from '@/lib/types';
import { PortalField } from './PortalUI';

interface CategoryFormModalProps {
  category: Category | null;
  onClose: () => void;
  onSave: (data: { name: string; slug: string }) => Promise<void>;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function CategoryFormModal({ category, onClose, onSave }: CategoryFormModalProps) {
  const isEdit = !!category;
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [form, setForm] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slugTouched && form.name) {
      setForm((f) => ({ ...f, slug: slugify(form.name) }));
    }
  }, [form.name, slugTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSave(form);
    } catch {
      setError('Failed to save category');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-xl sm:rounded-xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-semibold">{isEdit ? 'Edit category' : 'Add category'}</h2>
            <p className="text-xs text-muted mt-0.5">Organize products by collection</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <PortalField label="Category name">
            <input
              required
              autoFocus
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              placeholder="Tops"
            />
          </PortalField>

          <PortalField label="URL slug" hint="Used in /collections/{slug}">
            <input
              required
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm({ ...form, slug: e.target.value });
              }}
              className="input-field font-mono text-sm"
              placeholder="tops"
            />
          </PortalField>

          {error && <p className="text-sm text-sale">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : isEdit ? 'Save changes' : 'Create category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
