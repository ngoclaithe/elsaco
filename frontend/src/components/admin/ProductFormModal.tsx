'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Product, ProductFormInput } from '@/lib/types';
import { PortalField } from './PortalUI';

interface ProductFormModalProps {
  product: Product | null;
  categories: { id: string; name: string }[];
  onClose: () => void;
  onSave: (data: ProductFormInput) => Promise<void>;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function ProductFormModal({ product, categories, onClose, onSave }: ProductFormModalProps) {
  const isEdit = !!product;
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [previewIndex, setPreviewIndex] = useState(0);
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    details: product?.details || '',
    price: product?.price?.toString() || '',
    comparePrice: product?.comparePrice?.toString() || '',
    sizes: product?.sizes?.join(', ') || 'M, L, XL',
    stock: product?.stock?.toString() || '0',
    featured: product?.featured || false,
    categoryId: product?.categoryId || product?.category?.id || categories[0]?.id || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slugTouched && form.name) {
      setForm((f) => ({ ...f, slug: slugify(form.name) }));
    }
  }, [form.name, slugTouched]);

  useEffect(() => {
    if (previewIndex >= images.length) {
      setPreviewIndex(Math.max(0, images.length - 1));
    }
  }, [images.length, previewIndex]);

  const addImage = () => {
    const url = newImageUrl.trim();
    if (!url) return;
    setImages((prev) => [...prev, url]);
    setNewImageUrl('');
    setPreviewIndex(images.length);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= images.length) return;
    setImages((prev) => {
      const copy = [...prev];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
    setPreviewIndex(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setError('Add at least one product image');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onSave({
        name: form.name,
        slug: form.slug,
        description: form.description,
        details: form.details || undefined,
        price: parseInt(form.price, 10),
        comparePrice: form.comparePrice ? parseInt(form.comparePrice, 10) : undefined,
        images,
        sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        stock: parseInt(form.stock, 10),
        featured: form.featured,
        categoryId: form.categoryId,
      });
    } catch {
      setError('Failed to save product');
    }
    setLoading(false);
  };

  const activePreview = images[previewIndex] || images[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-5xl max-h-[96vh] sm:max-h-[92vh] overflow-hidden rounded-t-xl sm:rounded-xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-semibold">{isEdit ? 'Edit product' : 'Add product'}</h2>
            <p className="text-xs text-muted mt-0.5">Manage images, pricing, and inventory</p>
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="grid lg:grid-cols-2 gap-0 lg:gap-8 p-6">
            <div className="space-y-4 mb-6 lg:mb-0">
              <PortalField label="Product images" hint="First image is used as the main photo">
                <div className="border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                  <div className="relative aspect-[4/5] bg-white">
                    {activePreview ? (
                      <Image
                        src={activePreview}
                        alt="Preview"
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">
                        No image yet
                      </div>
                    )}
                  </div>

                  {images.length > 0 && (
                    <div className="flex gap-2 p-3 overflow-x-auto border-t border-neutral-200 bg-white">
                      {images.map((url, i) => (
                        <button
                          key={`${url}-${i}`}
                          type="button"
                          onClick={() => setPreviewIndex(i)}
                          className={`relative w-16 h-20 shrink-0 rounded overflow-hidden border-2 ${
                            previewIndex === i ? 'border-black' : 'border-transparent'
                          }`}
                        >
                          <Image src={url} alt="" fill unoptimized className="object-cover" />
                          {i === 0 && (
                            <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[9px] py-0.5 text-center">
                              Main
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </PortalField>

              <div className="flex gap-2">
                <input
                  placeholder="Paste image URL (Shopify CDN, etc.)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addImage();
                    }
                  }}
                  className="input-field flex-1"
                />
                <button type="button" onClick={addImage} className="btn-secondary !px-4 shrink-0">
                  Add
                </button>
              </div>

              {images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => removeImage(previewIndex)}
                    className="text-xs px-3 py-1.5 border border-neutral-300 rounded hover:border-black"
                  >
                    Remove selected
                  </button>
                  <button
                    type="button"
                    disabled={previewIndex === 0}
                    onClick={() => moveImage(previewIndex, -1)}
                    className="text-xs px-3 py-1.5 border border-neutral-300 rounded hover:border-black disabled:opacity-40"
                  >
                    Move left
                  </button>
                  <button
                    type="button"
                    disabled={previewIndex >= images.length - 1}
                    onClick={() => moveImage(previewIndex, 1)}
                    className="text-xs px-3 py-1.5 border border-neutral-300 rounded hover:border-black disabled:opacity-40"
                  >
                    Move right
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <PortalField label="Product name">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                />
              </PortalField>

              <PortalField label="URL slug">
                <input
                  required
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setForm({ ...form, slug: e.target.value });
                  }}
                  className="input-field font-mono text-sm"
                />
              </PortalField>

              <div className="grid sm:grid-cols-2 gap-4">
                <PortalField label="Category">
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="input-field"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </PortalField>
                <PortalField label="Stock">
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="input-field"
                  />
                </PortalField>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <PortalField label="Price (VND)">
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="input-field"
                  />
                </PortalField>
                <PortalField label="Compare price">
                  <input
                    type="number"
                    min={0}
                    value={form.comparePrice}
                    onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
                    className="input-field"
                    placeholder="Optional"
                  />
                </PortalField>
              </div>

              <PortalField label="Sizes" hint="Comma separated, e.g. M, L, XL">
                <input
                  value={form.sizes}
                  onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                  className="input-field"
                />
              </PortalField>

              <PortalField label="Short description">
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field"
                  placeholder="BOXY FIT"
                />
              </PortalField>

              <PortalField label="Details">
                <textarea
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  className="input-field h-28 resize-y"
                />
              </PortalField>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="accent-black w-4 h-4"
                />
                Featured on homepage
              </label>

              {error && <p className="text-sm text-sale">{error}</p>}
            </div>
          </div>

          <div className="sticky bottom-0 flex gap-3 px-6 py-4 border-t border-neutral-200 bg-white">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 sm:flex-none sm:min-w-[120px]">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 sm:flex-none sm:min-w-[160px]">
              {loading ? 'Saving...' : isEdit ? 'Save changes' : 'Create product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
