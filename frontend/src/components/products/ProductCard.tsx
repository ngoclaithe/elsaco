'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, isOnSale } from '@/lib/utils/format';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const onSale = isOnSale(product);

  return (
    <div className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-3">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {onSale && (
            <span className="absolute top-3 left-3 bg-sale text-white text-2xs font-medium uppercase tracking-wider px-2 py-1">
              Sale
            </span>
          )}
        </div>
      </Link>

      <div className="space-y-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm leading-snug line-clamp-2 group-hover:underline">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm">{formatPrice(product.price)}</span>
          {onSale && product.comparePrice && (
            <span className="text-sm text-muted line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
