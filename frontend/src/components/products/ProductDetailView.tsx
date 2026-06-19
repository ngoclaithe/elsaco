'use client';

import { useState } from 'react';
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

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d={direction === 'left' ? 'M13 4L7 10l6 6' : 'M7 4l6 6-6 6'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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

  const displayIndex = previewIndex ?? activeImage;
  const displaySrc = product.images[displayIndex] || product.images[0];
  const hasMultiple = product.images.length > 1;

  const goImage = (dir: -1 | 1) => {
    setPreviewIndex(null);
    const next = displayIndex + dir;
    if (next < 0) onSelectImage(product.images.length - 1);
    else if (next >= product.images.length) onSelectImage(0);
    else onSelectImage(next);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
      <div>
        <div className="group relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-4">
          <ProductImage
            key={displaySrc}
            src={displaySrc}
            alt={product.name}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] animate-fade-in"
          />

          {onSale && (
            <span className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-black text-white text-[10px] font-medium flex items-center justify-center pointer-events-none">
              Sale
            </span>
          )}

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={() => goImage(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white border border-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronIcon direction="left" />
              </button>
              <button
                type="button"
                onClick={() => goImage(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white border border-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronIcon direction="right" />
              </button>
            </>
          )}
        </div>

        {hasMultiple && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {product.images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setPreviewIndex(null);
                  onSelectImage(i);
                }}
                onMouseEnter={() => setPreviewIndex(i)}
                onMouseLeave={() => setPreviewIndex(null)}
                className={`relative w-16 h-20 shrink-0 overflow-hidden border-2 transition-all duration-200 ${
                  activeImage === i
                    ? 'border-black'
                    : previewIndex === i
                      ? 'border-neutral-400 opacity-100'
                      : 'border-transparent opacity-60 hover:border-neutral-300 hover:opacity-100'
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
  );
}
