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
      <section className="relative w-full h-[70vh] min-h-[500px] bg-neutral-900 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
          alt="elSaco Hero"
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-end justify-center pb-16 lg:pb-24">
          <Link href="/shop" className="btn-primary">
            Shop now
          </Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16 lg:py-24">
          <ProductGrid products={featured} />
        </section>
      )}
    </>
  );
}
