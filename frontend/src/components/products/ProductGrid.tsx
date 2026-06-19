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
        ? 'grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-2 lg:grid-cols-4';

  return (
    <div
      className={clsx(
        'grid',
        colClass,
        tight ? 'gap-px bg-neutral-200' : 'gap-4 lg:gap-6',
        !tight && 'max-w-[1400px] mx-auto px-4 lg:px-8 py-8 lg:py-12',
        className,
      )}
    >
      {products.map((product) => (
        <div key={product.id} className={clsx(tight && 'bg-white p-3 sm:p-4')}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
