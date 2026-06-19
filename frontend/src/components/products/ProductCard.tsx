'use client';

import Link from 'next/link';
import { ProductImage } from './ProductImage';
import { formatPrice, isOnSale } from '@/lib/utils/format';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  showQuickActions?: boolean;
}

export function ProductCard({ product, showQuickActions = true }: ProductCardProps) {
  const onSale = isOnSale(product);

  return (
    <div className="group">
      <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-3">
        <Link href={`/products/${product.slug}`} className="block absolute inset-0">
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 lg:group-hover:scale-[1.03]"
          />
        </Link>

        {onSale && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black text-white text-[10px] font-medium flex items-center justify-center">
            Sale
          </span>
        )}

        {showQuickActions && product.stock > 0 && (
          <div className="absolute inset-x-0 bottom-0 z-10 flex translate-y-0 opacity-100 lg:translate-y-full lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-300">
            <Link
              href={`/products/${product.slug}`}
              className="flex-1 bg-white/95 backdrop-blur text-center py-3 text-xs uppercase tracking-wider border-t border-neutral-200 hover:bg-black hover:text-white transition-colors min-h-[44px] flex items-center justify-center"
            >
              Choose
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-1 px-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm leading-snug line-clamp-2 hover:underline uppercase tracking-wide">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm sm:text-[15px]">{formatPrice(product.price)}</span>
          {onSale && product.comparePrice && (
            <span className="text-sm sm:text-[15px] text-muted line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
