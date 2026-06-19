'use client';

import { useState, useCallback } from 'react';
import { ProductImage } from './ProductImage';
import { formatPrice, isOnSale } from '@/lib/utils/format';
import type { Product } from '@/lib/types';

interface ProductDetailViewProps {
  product: Product;
  selectedSize: string;
  onSelectSize: (size: string) => void;
  activeImage: number;
  onSelectImage: (index: number) => void;
  adding: boolean;
  buying: boolean;
  error: string;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export function ProductDetailView({
  product,
  selectedSize,
  onSelectSize,
  activeImage,
  onSelectImage,
  adding,
  buying,
  error,
  onAddToCart,
  onBuyNow,
}: ProductDetailViewProps) {
  const onSale = isOnSale(product);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const displayIndex = previewIndex ?? activeImage;
  const displaySrc = product.images[displayIndex] || product.images[0];

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const goLightbox = useCallback(
    (dir: -1 | 1) => {
      setLightboxIndex((i) => {
        const next = i + dir;
        if (next < 0) return product.images.length - 1;
        if (next >= product.images.length) return 0;
        return next;
      });
    },
    [product.images.length],
  );

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div>
          <button
            type="button"
            onClick={() => openLightbox(displayIndex)}
            className="group relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-4 w-full cursor-zoom-in"
            aria-label="View image preview"
          >
            <ProductImage
              key={displaySrc}
              src={displaySrc}
              alt={product.name}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] animate-fade-in"
            />
            {onSale && (
              <span className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-black text-white text-[10px] font-medium flex items-center justify-center pointer-events-none">
                Sale
              </span>
            )}
            <span className="absolute bottom-4 right-4 z-10 bg-white/90 text-xs uppercase tracking-wider px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Preview
            </span>
          </button>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectImage(i)}
                  onMouseEnter={() => setPreviewIndex(i)}
                  onMouseLeave={() => setPreviewIndex(null)}
                  onFocus={() => setPreviewIndex(i)}
                  onBlur={() => setPreviewIndex(null)}
                  className={`relative w-16 h-20 shrink-0 overflow-hidden border-2 transition-all duration-200 hover:opacity-100 ${
                    activeImage === i
                      ? 'border-black'
                      : previewIndex === i
                        ? 'border-neutral-400 opacity-100'
                        : 'border-transparent opacity-60 hover:border-neutral-300'
                  }`}
                >
                  <ProductImage src={img} alt="" sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:pt-8">
          <p className="text-xs text-muted uppercase tracking-wider mb-2">elSaco</p>
          <h1 className="text-2xl lg:text-3xl font-medium mb-4 uppercase tracking-wide">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl">{formatPrice(product.price)}</span>
            {onSale && product.comparePrice && (
              <span className="text-lg text-muted line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {product.stock > 0 && product.stock <= 10 && (
            <p className="text-sm text-sale mb-4">{product.stock} left</p>
          )}

          <div className="mb-6">
            <p className="text-sm font-medium mb-3">
              Size{' '}
              <span className="font-normal text-muted">{selectedSize || 'Select size'}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSelectSize(size)}
                  disabled={product.stock === 0}
                  className={`min-w-[48px] px-4 py-2 border text-sm transition-colors ${
                    selectedSize === size
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-300 hover:border-black'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-sale mb-4">{error}</p>}

          <button
            type="button"
            onClick={onAddToCart}
            disabled={product.stock === 0 || adding || buying}
            className="btn-primary w-full mb-3"
          >
            {product.stock === 0 ? 'Sold out' : adding ? 'Adding...' : 'Add to cart'}
          </button>

          <button
            type="button"
            onClick={onBuyNow}
            disabled={product.stock === 0 || adding || buying}
            className="btn-secondary w-full"
          >
            {buying ? 'Processing...' : 'Buy now'}
          </button>

          <div className="border-t border-neutral-200 pt-6 mt-6 space-y-4">
            <p className="text-sm font-medium uppercase tracking-wider">{product.description}</p>
            {product.details && (
              <div className="text-sm text-muted whitespace-pre-line leading-relaxed">
                {product.details}
              </div>
            )}
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white p-2 text-2xl leading-none"
            aria-label="Close preview"
          >
            ✕
          </button>

          {product.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goLightbox(-1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white p-3 text-3xl"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goLightbox(1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white p-3 text-3xl"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          <div
            className="relative w-full max-w-4xl mx-4 aspect-[3/4] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <ProductImage
              key={product.images[lightboxIndex]}
              src={product.images[lightboxIndex]}
              alt={product.name}
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {product.images.length > 1 && (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {lightboxIndex + 1} / {product.images.length}
            </p>
          )}
        </div>
      )}
    </>
  );
}
