'use client';

import Image from 'next/image';
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
  error: string;
  onAddToCart: () => void;
}

export function ProductDetailView({
  product,
  selectedSize,
  onSelectSize,
  activeImage,
  onSelectImage,
  adding,
  error,
  onAddToCart,
}: ProductDetailViewProps) {
  const onSale = isOnSale(product);

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
      <div>
        <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-4">
          <ProductImage
            src={product.images[activeImage] || product.images[0]}
            alt={product.name}
            priority
            className="object-cover"
          />
          {onSale && (
            <span className="absolute top-4 left-4 bg-sale text-white text-xs font-medium uppercase tracking-wider px-3 py-1">
              Sale
            </span>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => onSelectImage(i)}
                className={`relative w-16 h-20 overflow-hidden border-2 ${
                  activeImage === i ? 'border-black' : 'border-transparent'
                }`}
              >
                <ProductImage src={img} alt="" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="lg:pt-8">
        <p className="text-xs text-muted uppercase tracking-wider mb-2">elSaco</p>
        <h1 className="text-2xl lg:text-3xl font-medium mb-4">{product.name}</h1>

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
            Size <span className="font-normal text-muted">{selectedSize || 'Select size'}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
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
          onClick={onAddToCart}
          disabled={product.stock === 0 || adding}
          className="btn-primary w-full mb-4"
        >
          {product.stock === 0 ? 'Sold out' : adding ? 'Adding...' : 'Add to cart'}
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
