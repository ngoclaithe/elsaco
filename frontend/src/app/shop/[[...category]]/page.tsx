'use client';

import { Suspense } from 'react';
import { useShop } from '@/hooks/useShop';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ShopFilters } from '@/components/shop/ShopFilters';
import { ShopToolbar } from '@/components/shop/ShopToolbar';

function ShopContent() {
  const shop = useShop();

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        <ShopFilters
          inStock={shop.inStock}
          setInStock={shop.setInStock}
          minPrice={shop.minPrice}
          setMinPrice={shop.setMinPrice}
          maxPrice={shop.maxPrice}
          setMaxPrice={shop.setMaxPrice}
          clearFilters={shop.clearFilters}
        />

        <div className="flex-1">
          <ShopToolbar
            total={shop.total}
            sort={shop.sort}
            setSort={shop.setSort}
            sortOptions={shop.sortOptions}
            filterOpen={shop.filterOpen}
            setFilterOpen={shop.setFilterOpen}
            inStock={shop.inStock}
            setInStock={shop.setInStock}
            minPrice={shop.minPrice}
            setMinPrice={shop.setMinPrice}
            maxPrice={shop.maxPrice}
            setMaxPrice={shop.setMaxPrice}
            clearFilters={shop.clearFilters}
          />

          <h1 className="sr-only">{shop.categoryTitle}</h1>

          {shop.loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-neutral-200 mb-3" />
                  <div className="h-4 bg-neutral-200 w-3/4 mb-2" />
                  <div className="h-4 bg-neutral-200 w-1/2" />
                </div>
              ))}
            </div>
          ) : shop.products.length === 0 ? (
            <p className="text-center text-muted py-16">No products found</p>
          ) : (
            <ProductGrid products={shop.products} columns={3} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
