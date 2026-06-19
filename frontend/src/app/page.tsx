import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedProducts } from '@/lib/server-api';
import { ProductGrid } from '@/components/products/ProductGrid';

export default async function HomePage() {
  let featured: import('@/lib/types').Product[] = [];
  try {
    featured = await getFeaturedProducts();
  } catch {
    featured = [];
  }

  return (
    <>
      <section className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9] max-h-[90vh] bg-neutral-900">
        <Image
          src="https://cdn.shopify.com/s/files/1/0824/3373/6933/files/201.png?width=1920"
          alt="elSaco"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 flex items-end justify-center pb-12 sm:pb-16">
          <Link href="/collections/all-products" className="btn-primary min-w-[220px] text-center">
            Shop now
          </Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="w-full pt-0">
          <ProductGrid products={featured} tight />
        </section>
      )}
    </>
  );
}
