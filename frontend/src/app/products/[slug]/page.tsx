'use client';

import { notFound } from 'next/navigation';
import { useProduct } from '@/hooks/useProduct';
import { ProductDetailView } from '@/components/products/ProductDetailView';
import { ProductGrid } from '@/components/products/ProductGrid';

export default function ProductPage() {
  const {
    product,
    related,
    selectedSize,
    setSelectedSize,
    activeImage,
    setActiveImage,
    loading,
    adding,
    buying,
    error,
    handleAddToCart,
    handleBuyNow,
  } = useProduct();

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-[3/4] bg-neutral-200" />
          <div className="space-y-4">
            <div className="h-8 bg-neutral-200 w-3/4" />
            <div className="h-6 bg-neutral-200 w-1/4" />
            <div className="h-32 bg-neutral-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) notFound();

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <ProductDetailView
        product={product}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        activeImage={activeImage}
        onSelectImage={setActiveImage}
        adding={adding}
        buying={buying}
        error={error}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {related.length > 0 && (
        <section className="mt-16 lg:mt-24">
          <h2 className="text-lg font-medium mb-8">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
