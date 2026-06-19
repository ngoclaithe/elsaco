import { ProductCard } from './ProductCard';
import type { Product } from '@/lib/types';
import clsx from 'clsx';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  tight?: boolean;
  className?: string;
}

export function ProductGrid({ products, columns = 4, tight = false, className }: ProductGridProps) {
  const colClass =
    columns === 2
      ? 'grid-cols-2'
      : columns === 3
        ? 'grid-cols-2 md:grid-cols-3'
        : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <div
      className={clsx(
        'grid',
        colClass,
        tight ? 'gap-px bg-neutral-200' : 'gap-3 sm:gap-4 lg:gap-6',
        !tight && 'store-container py-6 sm:py-8 lg:py-12',
        className,
      )}
    >
      {products.map((product) => (
        <div key={product.id} className={clsx(tight && 'bg-white p-2 sm:p-3 md:p-4')}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
