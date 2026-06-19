'use client';

import { useState } from 'react';
import type { Product, ProductFormInput } from '@/lib/types';

interface ProductFormModalProps {
  product: Product | null;
  categories: { id: string; name: string }[];
  onClose: () => void;
  onSave: (data: ProductFormInput) => Promise<void>;
}

export function ProductFormModal({ product, categories, onClose, onSave }: ProductFormModalProps) {
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    details: product?.details || '',
    price: product?.price?.toString() || '',
    comparePrice: product?.comparePrice?.toString() || '',
    images: product?.images?.join('\n') || '',
    sizes: product?.sizes?.join(', ') || 'M, L, XL',
    stock: product?.stock?.toString() || '0',
    featured: product?.featured || false,
    categoryId: product?.categoryId || product?.category?.id || categories[0]?.id || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        name: form.name,
        slug: form.slug,
        description: form.description,
        details: form.details || undefined,
        price: parseInt(form.price),
        comparePrice: form.comparePrice ? parseInt(form.comparePrice) : undefined,
        images: form.images.split('\n').filter(Boolean),
        sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        stock: parseInt(form.stock),
        featured: form.featured,
        categoryId: form.categoryId,
      });
    } catch {
      alert('Failed to save product');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-lg font-medium mb-6">{product ? 'Edit product' : 'Add product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          <input placeholder="Slug" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-field" />
          <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input-field">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input placeholder="Price" type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
          <input placeholder="Compare price" type="number" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} className="input-field" />
          <input placeholder="Stock" type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" />
          <input placeholder="Sizes" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className="input-field" />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" />
          <textarea placeholder="Details" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} className="input-field h-24 resize-none" />
          <textarea placeholder="Image URLs" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="input-field h-20 resize-none" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-black" />
            Featured on homepage
          </label>
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
